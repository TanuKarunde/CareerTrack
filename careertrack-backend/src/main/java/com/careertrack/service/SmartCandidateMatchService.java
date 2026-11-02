
package com.careertrack.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.careertrack.dto.SmartMatchResponse;
import com.careertrack.entity.Application;
import com.careertrack.entity.CompanyMember;
import com.careertrack.entity.CompanyMemberStatus;
import com.careertrack.entity.Job;
import com.careertrack.entity.User;
import com.careertrack.repository.ApplicationRepository;
import com.careertrack.repository.CompanyMemberRepository;
import com.careertrack.repository.JobReadinessReportRepository;
import com.careertrack.repository.JobRepository;
import com.careertrack.repository.StudentProfileRepository;

@Service
public class SmartCandidateMatchService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentProfileRepository profileRepository;
    private final CompanyMemberRepository companyMemberRepository;
    private final JobReadinessReportRepository readinessRepository;

    private final ResumeParserService resumeParserService;
    private final JobMatchService jobMatchService;
    private final ResumeScoringService resumeScoringService;

    public SmartCandidateMatchService(
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            StudentProfileRepository profileRepository,
            CompanyMemberRepository companyMemberRepository,
            JobReadinessReportRepository readinessRepository,
            ResumeParserService resumeParserService,
            JobMatchService jobMatchService,
            ResumeScoringService resumeScoringService) {

        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.profileRepository = profileRepository;
        this.companyMemberRepository = companyMemberRepository;
        this.readinessRepository = readinessRepository;
        this.resumeParserService = resumeParserService;
        this.jobMatchService = jobMatchService;
        this.resumeScoringService = resumeScoringService;
    }

    @Transactional(readOnly = true)
    public List<SmartMatchResponse> getRankedCandidates(
            Long jobId,
            User employer) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Job not found"));

        validateCompanyAccess(job, employer);

        List<Application> applications =
                applicationRepository
                        .findByJobIdOrderByAppliedAtDesc(jobId);

        return applications.stream()
                .map(application -> buildCandidate(application, job))
                .sorted(
                    java.util.Comparator.comparing(
                        SmartMatchResponse::getMatchScore,
                        java.util.Comparator.nullsLast(
                            java.util.Comparator.reverseOrder()))
                    .thenComparing(
                        SmartMatchResponse::getStudentName,
                        java.util.Comparator.nullsLast(
                            String.CASE_INSENSITIVE_ORDER))
                )
                .toList();
    }

    private void validateCompanyAccess(Job job, User employer) {

        CompanyMember employerMembership =
                companyMemberRepository
                    .findByUserAndStatus(
                        employer,
                        CompanyMemberStatus.APPROVED)
                    .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You do not belong to an approved company"));

        CompanyMember jobOwnerMembership =
                companyMemberRepository
                    .findByUserAndStatus(
                        job.getEmployer(),
                        CompanyMemberStatus.APPROVED)
                    .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "The job owner has no approved company membership"));

        if (!employerMembership.getCompany().getId()
                .equals(jobOwnerMembership.getCompany().getId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot view candidates for another company's job");
        }
    }

    private SmartMatchResponse buildCandidate(
            Application application,
            Job job) {

        User student = application.getStudent();

        var readiness =
                readinessRepository
                    .findTopByStudentIdAndJobIdOrderByCreatedAtDesc(
                        student.getId(),
                        job.getId());

        SmartMatchResponse response = new SmartMatchResponse();

        response.setApplicationId(application.getId());
        response.setStudentId(student.getId());
        response.setStudentName(
                student.getName() == null
                    ? student.getEmail()
                    : student.getName());
        response.setEmail(student.getEmail());
        response.setJobTitle(job.getTitle());
        response.setApplicationStatus(
                application.getStatus() == null
                    ? null
                    : application.getStatus().name());

        response.setReadinessReportAvailable(readiness.isPresent());

        Integer readinessScore = readiness
                .map(report -> report.getReadinessScore())
                .orElse(null);

        response.setReadinessScore(readinessScore);

        // Analyze only the resume snapshot saved with this application.
        byte[] applicationResume = application.getResume();
        String resumeName = application.getResumeName();
        String resumeType = application.getResumeType();

        if (applicationResume == null || applicationResume.length == 0) {
            return markResumeUnavailable(
                    response,
                    "This application does not contain a resume.",
                    "Resume-based matching is unavailable for this application.");
        }

        try {
            String resumeText = resumeParserService.extractText(
                    applicationResume,
                    resumeName,
                    resumeType);

            // Do not use profile skills as evidence for this application.
            Map<String, Object> jobMatch =
                    jobMatchService.match(resumeText, null, job);
            
            System.out.println("========== JOB MATCH DEBUG ==========");
            System.out.println("Job ID: " + job.getId());
            System.out.println("Job Title: " + job.getTitle());
            System.out.println("Job Skills: " + job.getSkills());
            System.out.println("Job Description: " + job.getDescription());
            System.out.println("Extracted Resume Text Length: "
                    + (resumeText == null ? 0 : resumeText.length()));
            System.out.println("Job Match Score: "
                    + jobMatch.get("jobMatchScore"));
            System.out.println("Required Skill Count: "
                    + jobMatch.get("requiredSkillCount"));
            System.out.println("Matched Skills: "
                    + jobMatch.get("matchedSkills"));
            System.out.println("Missing Skills: "
                    + jobMatch.get("missingSkills"));
            System.out.println("Match Breakdown: "
                    + jobMatch.get("matchBreakdown"));
            System.out.println("====================================");

            Map<String, Object> resumeScore =
                    resumeScoringService.analyze(resumeText);

            response.setResumeAnalysisAvailable(true);

            Integer resumeScoreValue =
                    numberValue(resumeScore.get("overallScore"));

            response.setResumeScore(resumeScoreValue);

            List<String> matchedSkills =
                    stringList(jobMatch.get("matchedSkills"));

            List<String> missingSkills =
                    stringList(jobMatch.get("missingSkills"));

            response.setMatchedSkills(matchedSkills);
            response.setMissingSkills(missingSkills);

            Integer jobRelevance =
                    numberValue(jobMatch.get("jobMatchScore"));

            // JobMatchService uses -1 when it cannot calculate a score.
            if (jobRelevance != null && jobRelevance < 0) {
                jobRelevance = null;
            }

            response.setResumeJobMatchScore(jobRelevance);

            Map<String, Object> breakdown =
                    mapValue(jobMatch.get("matchBreakdown"));

            Integer experienceScore =
                    numberValue(breakdown.get("experienceScore"));

            Integer projectsScore =
                    numberValue(resumeScore.get("projectsScore"));

            Integer educationScore =
                    numberValue(resumeScore.get("educationScore"));

            Map<String, Object> details =
                    mapValue(resumeScore.get("extractedDetails"));

            boolean hasExperience =
                    booleanValue(details.get("experiencePresent"));

            boolean hasProjects =
                    booleanValue(details.get("projectsPresent"));

            boolean hasEducation =
                    booleanValue(details.get("educationPresent"));

            String lowerResume = resumeText.toLowerCase(Locale.ROOT);

            boolean hasCertifications = containsAny(
                    lowerResume,
                    "certifications",
                    "certificates",
                    "licenses");

            Integer certificationsScore = null;

            if (hasCertifications) {
                certificationsScore = certificationRelevance(
                        lowerResume,
                        job.getSkills());
            }

            /*
             * Use JobMatchService's requiredSkillCount.
             * This ensures the numerator and denominator use the same
             * required-skill set.
             */
            Integer requiredSkillCount =
                    numberValue(jobMatch.get("requiredSkillCount"));

            Integer skillsScore = null;

            if (requiredSkillCount != null && requiredSkillCount > 0) {
                skillsScore = (int) Math.round(
                        matchedSkills.size() * 100.0
                                / requiredSkillCount);

                skillsScore = Math.max(0, Math.min(100, skillsScore));
            }

            /*
             * Final SmartCandidate Match weights:
             * Skills             35%
             * Experience         30%
             * Projects           15%
             * Resume/job match   10%
             * Education           7%
             * Certifications      3%
             *
             * Unavailable factors are skipped and remaining weights
             * are normalized. Missing evidence is not automatically zero.
             */
            Integer overallMatch = calculateMatchScore(
                    readinessScore,
                    resumeScoreValue,
                    jobRelevance);

            response.setMatchScore(overallMatch);

            List<String> reasons = new ArrayList<>();

            if (!matchedSkills.isEmpty()) {
                reasons.add(
                        "Required skills found in the application resume: "
                                + String.join(", ", matchedSkills));
            }

            if (!missingSkills.isEmpty()) {
                reasons.add(
                        "Required skills not found in the application resume: "
                                + String.join(", ", missingSkills));
            }

            if (hasExperience && experienceScore != null) {
                reasons.add(
                        "Experience evidence was evaluated against the job level.");
            } else {
                reasons.add(
                        "A reliable experience score was not available.");
            }

            if (hasProjects) {
                reasons.add(
                        "A projects section was detected in the application resume.");
            }

            if (hasEducation) {
                reasons.add(
                        "An education section was detected in the application resume.");
            }

            if (hasCertifications) {
                reasons.add(
                        "A certifications-related section or keyword was detected.");
            }

            if (jobRelevance != null) {
                reasons.add(
                        "Application resume/job relevance score: "
                                + jobRelevance + "/100");
            }

            if (overallMatch == null) {
                reasons.add(
                        "There is not enough information to calculate a match score.");
            }

            reasons.add(
                    "The match score is a rule-based estimate, not a hiring decision.");

            response.setMatchReasons(reasons);

        } catch (Exception exception) {
            // Preserve the application even when its resume cannot be analysed.
            return markResumeUnavailable(
                    response,
                    "The application exists, but its resume could not be analysed.",
                    "Check that the attached resume is a readable PDF or DOCX file.");
        }

        return response;
    }

    private SmartMatchResponse markResumeUnavailable(
            SmartMatchResponse response,
            String reason1,
            String reason2) {

        response.setResumeAnalysisAvailable(false);
        response.setResumeScore(null);
        response.setResumeJobMatchScore(null);
        response.setMatchScore(null);
        response.setMatchedSkills(List.of());
        response.setMissingSkills(List.of());
        response.setMatchReasons(List.of(reason1, reason2));

        return response;
    }

    private Integer calculateMatchScore(
            Integer readinessScore,
            Integer resumeScore,
            Integer resumeJobMatchScore) {

        double weightedTotal = 0.0;
        double availableWeight = 0.0;

        // Job Readiness: 40%
        if (readinessScore != null) {
            weightedTotal += readinessScore * 0.40;
            availableWeight += 0.40;
        }

        // Resume Score: 25%
        if (resumeScore != null) {
            weightedTotal += resumeScore * 0.25;
            availableWeight += 0.25;
        }

        // Resume Job Match: 35%
        if (resumeJobMatchScore != null) {
            weightedTotal += resumeJobMatchScore * 0.35;
            availableWeight += 0.35;
        }

        // No scores available
        if (availableWeight == 0.0) {
            return null;
        }

        // Normalize weights when some scores are unavailable
        return (int) Math.round(
                weightedTotal / availableWeight);
    }

    private Integer certificationRelevance(
            String resumeText,
            String jobSkills) {

        List<String> skills = parseSkills(jobSkills);

        if (skills.isEmpty()) {
            return null;
        }

        long matches = skills.stream()
                .filter(skill -> containsPhrase(resumeText, skill))
                .count();

        return (int) Math.round(matches * 100.0 / skills.size());
    }

    private List<String> parseSkills(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of();
        }

        return java.util.Arrays.stream(raw.split("[,;\\n|]"))
                .map(String::trim)
                .filter(skill -> !skill.isEmpty())
                .distinct()
                .toList();
    }

    private List<String> stringList(Object value) {
        if (!(value instanceof List<?> list)) {
            return List.of();
        }

        return list.stream()
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .toList();
    }

    private Map<String, Object> mapValue(Object value) {
        if (!(value instanceof Map<?, ?> map)) {
            return Map.of();
        }

        Map<String, Object> result = new LinkedHashMap<>();

        map.forEach((key, item) -> {
            if (key instanceof String stringKey) {
                result.put(stringKey, item);
            }
        });

        return result;
    }

    private Integer numberValue(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }

        return null;
    }

    private boolean booleanValue(Object value) {
        return Boolean.TRUE.equals(value);
    }

    private boolean containsAny(String text, String... terms) {
        for (String term : terms) {
            if (text.contains(term)) {
                return true;
            }
        }

        return false;
    }

    private boolean containsPhrase(String text, String phrase) {
        String normalizedText = normalize(text);
        String normalizedPhrase = normalize(phrase);

        if (normalizedPhrase.isBlank()) {
            return false;
        }

        String regex = "(^| )"
                + java.util.regex.Pattern.quote(normalizedPhrase)
                + "( |$)";

        return java.util.regex.Pattern.compile(regex)
                .matcher(normalizedText)
                .find();
    }

    private String normalize(String value) {
        return value == null
                ? ""
                : value.toLowerCase(Locale.ROOT)
                        .replaceAll("[^a-z0-9+#.]+", " ")
                        .replaceAll("\\s+", " ")
                        .trim();
    }
}
