
package com.careertrack.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.careertrack.dto.JobReadinessResponse;
import com.careertrack.entity.Experience;
import com.careertrack.entity.Job;
import com.careertrack.entity.JobReadinessReport;
import com.careertrack.entity.StudentProfile;
import com.careertrack.entity.StudentProject;
import com.careertrack.entity.User;
import com.careertrack.repository.JobReadinessReportRepository;
import com.careertrack.repository.JobRepository;
import com.careertrack.repository.StudentProfileRepository;
import com.careertrack.repository.StudentProjectRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class JobReadinessService {

    private final JobRepository jobRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final StudentProjectRepository studentProjectRepository;
    private final JobReadinessReportRepository reportRepository;
    private final ObjectMapper objectMapper;

    public JobReadinessService(
            JobRepository jobRepository,
            StudentProfileRepository studentProfileRepository,
            StudentProjectRepository studentProjectRepository,
            JobReadinessReportRepository reportRepository,
            ObjectMapper objectMapper) {

        this.jobRepository = jobRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.studentProjectRepository = studentProjectRepository;
        this.reportRepository = reportRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public JobReadinessResponse calculateReadiness(Long jobId, User user) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Job not found"));

        if (!job.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This job is not currently active");
        }

        StudentProfile profile = studentProfileRepository
                .findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Please complete your student profile first"));

        List<String> requiredSkills = parseSkills(job.getSkills());

        if (requiredSkills.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This job does not have configured skills yet");
        }

        List<StudentProject> projects =
                studentProjectRepository.findByStudentProfileId(
                        profile.getId());


        // 1. SKILL MATCH: percentage out of 100
        Set<String> studentSkills = parseSkills(profile.getSkills())
                .stream()
                .map(this::normalizeSkill)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String skill : requiredSkills) {
            if (studentSkills.contains(normalizeSkill(skill))) {
                matchedSkills.add(skill);
            } else {
                missingSkills.add(skill);
            }
        }

        int skillPercentage = score(
                matchedSkills.size(), requiredSkills.size(), 100);

        // 2. EXPERIENCE: percentage out of 100
        int experiencePercentage = calculateExperienceScore(profile, job);

        // 3. PROJECTS: percentage out of 100
        Set<String> projectSkills = new LinkedHashSet<>();

        for (StudentProject project : projects) {
            projectSkills.addAll(
                    parseSkills(project.getTechnologies())
                            .stream()
                            .map(this::normalizeSkill)
                            .collect(Collectors.toSet()));

            String description = safe(project.getDescription());

            for (String skill : requiredSkills) {
                if (containsSkill(description, skill)) {
                    projectSkills.add(normalizeSkill(skill));
                }
            }
        }

        long projectMatches = requiredSkills.stream()
                .map(this::normalizeSkill)
                .filter(projectSkills::contains)
                .distinct()
                .count();

        int projectPercentage = score(
                (int) projectMatches, requiredSkills.size(), 100);

        // 4. EDUCATION: percentage out of 100
        int educationPercentage = calculateEducationPercentage(profile);

        // 5. PROFILE COMPLETENESS: percentage out of 100
        int profilePercentage = calculateProfilePercentage(profile);

        // 6. ABOUT / BIO: percentage out of 100
        int aboutPercentage = calculateAboutPercentage(profile);

        // Convert percentages into weighted contributions.
        int skillContribution = weightedScore(skillPercentage, 30);
        int experienceContribution = weightedScore(experiencePercentage, 20);
        int projectContribution = weightedScore(projectPercentage, 20);
        int educationContribution = weightedScore(educationPercentage, 10);
        int profileContribution = weightedScore(profilePercentage, 10);
        int aboutContribution = weightedScore(aboutPercentage, 10);

        int totalScore = skillContribution
                + experienceContribution
                + projectContribution
                + educationContribution
                + profileContribution
                + aboutContribution;


        List<String> suggestions = buildSuggestions(
                missingSkills,
                experiencePercentage,
                projectPercentage,
                educationPercentage,
                profilePercentage,
                aboutPercentage);

        JobReadinessReport report = reportRepository
                .findTopByStudentIdAndJobIdOrderByCreatedAtDesc(
                        user.getId(), jobId)
                .orElseGet(JobReadinessReport::new);


report.setStudentId(user.getId());
report.setJobId(jobId);
report.setReadinessScore(totalScore);

// Store percentages for the breakdown cards.
report.setSkillMatchScore(skillPercentage);
report.setExperienceScore(experiencePercentage);
report.setProjectScore(projectPercentage);
report.setEducationScore(educationPercentage);
report.setProfileScore(profilePercentage);
report.setAboutScore(aboutPercentage);

// Legacy field; no longer used for the new breakdown.
report.setCriteriaScore(0);


        try {
            report.setMatchedSkills(
                    objectMapper.writeValueAsString(matchedSkills));

            report.setMissingSkills(
                    objectMapper.writeValueAsString(missingSkills));

            report.setReportJson(objectMapper.writeValueAsString(
                    new ReportDetails(
                            requiredSkills,
                            suggestions,
                            "Skills: 30; experience: 20; projects: 20; "
                                    + "education: 10; profile completeness: 10; "
                                    + "about/bio: 10. Total: 100.")));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(
                    "Unable to create readiness report", e);
        }

        JobReadinessReport saved = reportRepository.save(report);

        return toResponse(
                saved, job, matchedSkills, missingSkills, suggestions);
    }

    @Transactional(readOnly = true)
    public JobReadinessResponse getReadiness(Long jobId, User user) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Job not found"));

        JobReadinessReport report = reportRepository
                .findTopByStudentIdAndJobIdOrderByCreatedAtDesc(
                        user.getId(), jobId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No readiness report found. Calculate it first."));

        return toResponse(
                report,
                job,
                readStringList(report.getMatchedSkills()),
                readStringList(report.getMissingSkills()),
                readSuggestions(report.getReportJson()));
    }

    @Transactional(readOnly = true)
    public List<JobReadinessResponse> getHistory(User user) {

        return reportRepository
                .findByStudentIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(report -> {
                    Job job = jobRepository.findById(report.getJobId())
                            .orElse(null);

                    return toResponse(
                            report,
                            job,
                            readStringList(report.getMatchedSkills()),
                            readStringList(report.getMissingSkills()),
                            readSuggestions(report.getReportJson()));
                })
                .toList();
    }


private int calculateExperienceScore(StudentProfile profile, Job job) {
    List<Experience> experiences = profile.getExperiences();

    String experienceLevel = safe(job.getExperienceLevel())
            .toLowerCase(Locale.ROOT);

    boolean fresherJob = experienceLevel.contains("fresher")
            || experienceLevel.contains("entry level")
            || experienceLevel.contains("entry-level")
            || experienceLevel.contains("intern");

    if (experiences == null || experiences.isEmpty()) {
        return fresherJob ? 100 : 0;
    }

    if (fresherJob) {
        return 100;
    }

    String jobText = safe(job.getTitle()) + " "
            + safe(job.getDescription());

    for (Experience experience : experiences) {
        if (containsMeaningfulOverlap(
                    safe(experience.getJobTitle()), jobText)
                || containsMeaningfulOverlap(
                    safe(experience.getDescription()), jobText)) {
            return 100;
        }
    }

    return 50;
}


    private boolean containsMeaningfulOverlap(
            String candidateText, String jobText) {

        Set<String> stopWords = Set.of(
                "the", "and", "for", "with", "from", "this",
                "that", "role", "work", "working", "developer",
                "engineer", "senior", "junior", "experience",
                "years", "year", "job", "position");

        Set<String> candidateWords = tokenize(candidateText);
        Set<String> jobWords = tokenize(jobText);

        candidateWords.removeAll(stopWords);
        jobWords.removeAll(stopWords);

        candidateWords.retainAll(jobWords);

        return !candidateWords.isEmpty();
    }

    private Set<String> tokenize(String value) {
        return Arrays.stream(safe(value)
                        .toLowerCase(Locale.ROOT)
                        .replaceAll("[^a-z0-9+#.]+", " ")
                        .split("\\s+"))
                .filter(word -> word.length() > 1)
                .collect(Collectors.toSet());
    }


private int calculateEducationPercentage(StudentProfile profile) {
    int completed = 0;
    int total = 5;

    if (hasText(profile.getDegree())) completed++;
    if (hasText(profile.getBranch())) completed++;
    if (hasText(profile.getCollege())) completed++;
    if (profile.getGraduationYear() != null) completed++;
    if (profile.getCgpa() != null && profile.getCgpa() > 0) completed++;

    return score(completed, total, 100);
}

private int calculateProfilePercentage(StudentProfile profile) {
    int completed = 0;
    int total = 8;

    if (hasText(profile.getPhone())) completed++;
    if (hasText(profile.getLocation())) completed++;
    if (profile.getDateOfBirth() != null) completed++;
    if (profile.getGender() != null) completed++;
    if (hasText(profile.getSkills())) completed++;
    if (hasText(profile.getLanguages())) completed++;

    if (hasText(profile.getGithubUrl())
            || hasText(profile.getLinkedinUrl())
            || hasText(profile.getPortfolioUrl())) {
        completed++;
    }

    if (profile.getResume() != null
            && profile.getResume().length > 0) {
        completed++;
    }

    return score(completed, total, 100);
}

private int calculateAboutPercentage(StudentProfile profile) {
    String bio = safe(profile.getBio()).trim();

    if (bio.isEmpty()) return 0;

    int wordCount = bio.split("\\s+").length;

    if (wordCount >= 50) return 100;
    if (wordCount >= 30) return 80;
    if (wordCount >= 15) return 60;
    if (wordCount >= 5) return 40;

    return 20;
}


    private int score(int matched, int total, int maximum) {
        if (total <= 0) return 0;

        return (int) Math.round(
                (matched * 1.0 / total) * maximum);
    }

    private List<String> parseSkills(String raw) {
        if (!hasText(raw)) return new ArrayList<>();

        return Arrays.stream(raw.split("[,;\\n|]"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .toList();
    }

    private String normalizeSkill(String skill) {
        String normalized = safe(skill)
                .toLowerCase(Locale.ROOT)
                .trim()
                .replaceAll("\\s+", " ");

        return switch (normalized) {
            case "springboot", "spring-boot" -> "spring boot";
            case "rest apis", "restful api", "restful apis" -> "rest api";
            case "mysql database" -> "mysql";
            case "core java" -> "java";
            default -> normalized;
        };
    }

    private boolean containsSkill(String text, String skill) {
        String normalizedText = " " + safe(text)
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9+#.]+", " ")
                .replaceAll("\\s+", " ")
                .trim() + " ";

        String normalizedSkill = " " + normalizeSkill(skill)
                .replaceAll("[^a-z0-9+#.]+", " ")
                .replaceAll("\\s+", " ")
                .trim() + " ";

        return normalizedText.contains(normalizedSkill);
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private List<String> readStringList(String json) {
        if (!hasText(json)) return new ArrayList<>();

        try {
            return objectMapper.readValue(
                    json,
                    objectMapper.getTypeFactory()
                            .constructCollectionType(
                                    List.class, String.class));
        } catch (Exception e) {
            return Arrays.asList(json);
        }
    }

    private List<String> readSuggestions(String json) {
        if (!hasText(json)) return new ArrayList<>();

        try {
            ReportDetails details = objectMapper.readValue(
                    json, ReportDetails.class);

            return details.suggestions == null
                    ? new ArrayList<>()
                    : details.suggestions;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private JobReadinessResponse toResponse(
            JobReadinessReport report,
            Job job,
            List<String> matchedSkills,
            List<String> missingSkills,
            List<String> suggestions) {

        JobReadinessResponse response = new JobReadinessResponse();

        response.setReportId(report.getId());
        response.setStudentId(report.getStudentId());
        response.setJobId(report.getJobId());
        response.setJobTitle(job == null
                ? "Job no longer available"
                : job.getTitle());

        response.setReadinessScore(report.getReadinessScore());
        response.setSkillMatchScore(report.getSkillMatchScore());
        response.setExperienceScore(report.getExperienceScore());
        response.setProjectScore(report.getProjectScore());
        response.setEducationScore(report.getEducationScore());
        response.setProfileScore(report.getProfileScore());
        response.setAboutScore(report.getAboutScore());

        // Kept so existing frontend code using criteriaScore still compiles.
        response.setCriteriaScore(
                report.getCriteriaScore() == null
                        ? 0
                        : report.getCriteriaScore());

        response.setMatchedSkills(matchedSkills);
        response.setMissingSkills(missingSkills);
        response.setSuggestions(suggestions);
        response.setCreatedAt(report.getCreatedAt());

        return response;
    }

    public static class ReportDetails {

        public List<String> requiredSkills;
        public List<String> suggestions;
        public String scoringExplanation;

        public ReportDetails() {
        }

        public ReportDetails(
                List<String> requiredSkills,
                List<String> suggestions,
                String scoringExplanation) {

            this.requiredSkills = requiredSkills;
            this.suggestions = suggestions;
            this.scoringExplanation = scoringExplanation;
        }
    }
    

private int weightedScore(int percentage, int weight) {
    int safePercentage = Math.max(0, Math.min(100, percentage));

    return (int) Math.round(safePercentage * weight / 100.0);
}

private List<String> buildSuggestions(
        List<String> missingSkills,
        int experiencePercentage,
        int projectPercentage,
        int educationPercentage,
        int profilePercentage,
        int aboutPercentage) {

    List<String> suggestions = new ArrayList<>();

    // 1. Missing skills
    if (missingSkills != null && !missingSkills.isEmpty()) {
        suggestions.add(
                "Develop these job-required skills: "
                        + String.join(", ", missingSkills));
    }

    // 2. Experience
    if (experiencePercentage < 100) {
        suggestions.add(
                "Add relevant experience, internships, or practical "
                        + "work details. Freshers should highlight relevant projects.");
    }

    // 3. Projects
    if (projectPercentage < 100) {
        suggestions.add(
                "Add projects that demonstrate the required job skills. "
                        + "Include accurate technologies and project descriptions.");
    }

    // 4. Education
    if (educationPercentage < 100) {
        suggestions.add(
                "Complete your education details, including degree, branch, "
                        + "college, graduation year, and CGPA where applicable.");
    }

    // 5. Profile completeness
    if (profilePercentage < 100) {
        suggestions.add(
                "Complete your profile with phone number, location, skills, "
                        + "languages, a professional link, and resume.");
    }

    // 6. About / Bio
    if (aboutPercentage < 100) {
        suggestions.add(
                "Improve your About section with a clear summary of your "
                        + "skills, projects, experience, and career goals.");
    }

    // If everything is complete
    if (suggestions.isEmpty()) {
        suggestions.add(
                "Your profile scores well against the configured readiness "
                        + "factors. Keep your skills and projects updated.");
    }

    return suggestions;
}

}
