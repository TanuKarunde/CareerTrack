
package com.careertrack.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.careertrack.entity.Job;
import com.careertrack.entity.StudentProfile;

@Service
public class JobMatchService {

    private static final List<String> KNOWN_SKILLS = Arrays.asList(
        "Java", "Spring Boot", "Spring MVC", "Spring Security",
        "Hibernate", "JPA", "SQL", "MySQL", "PostgreSQL",
        "React", "JavaScript", "TypeScript", "HTML", "CSS",
        "REST API", "Microservices", "Git", "GitHub",
        "Docker", "AWS", "DSA", "Data Structures",
        "OOP", "Maven", "JUnit", "Python"
    );

    private static final Set<String> STOP_WORDS = new LinkedHashSet<>(
        Arrays.asList(
            "the", "and", "for", "with", "from", "that", "this",
            "are", "you", "your", "our", "will", "have", "has",
            "job", "role", "work", "working", "using", "use",
            "ability", "skills", "skill", "experience", "years",
            "developer", "development", "engineer", "team",
            "strong", "good", "knowledge", "required", "preferred"
        )
    );

    // Keeps compatibility with existing callers.
    public Map<String, Object> match(String resumeText, Job job) {
        return match(resumeText, null, job);
    }

    public Map<String, Object> match(
            String resumeText,
            StudentProfile profile,
            Job job) {
    	
    	System.out.println("========== EXTRACTED RESUME TEXT ==========");
    	System.out.println(resumeText);
    	System.out.println("============================================");

        String resume = normalize(resumeText);

        String profileSkills = profile == null
                ? ""
                : safe(profile.getSkills());

        String candidateText = normalize(safe(resumeText));

        String jobSkillsText = normalize(safe(job.getSkills()));
        String jobTitleText = normalize(safe(job.getTitle()));
        String jobDescriptionText = normalize(safe(job.getDescription()));

        String jobText = normalize(
                safe(job.getTitle()) + " "
                + safe(job.getSkills()) + " "
                + safe(job.getDescription())
        );

        Set<String> requiredSkills = new LinkedHashSet<>();

        for (String skill : KNOWN_SKILLS) {
            if (containsSkill(jobSkillsText, skill)
                    || containsSkill(jobTitleText, skill)
                    || containsSkill(jobDescriptionText, skill)) {
                requiredSkills.add(skill);
            }
        }

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String skill : requiredSkills) {
            if (containsSkill(candidateText, skill)) {
                matchedSkills.add(skill);
            } else {
                missingSkills.add(skill);
            }
        }

        Map<String, Object> breakdown = new LinkedHashMap<>();
        Map<String, Integer> weights = new LinkedHashMap<>();

        // 1. Skills: 23%
        if (!requiredSkills.isEmpty()) {
            int score = (int) Math.round(
                    matchedSkills.size() * 100.0 / requiredSkills.size()
            );

            addFactor(breakdown, weights, "skillsScore", score, 23);
        }

     // 2. Preferred role relevance: 40%
     // Resume-based role relevance: 40%
        if (!resume.isBlank()) {
            int score = calculateResumeRoleScore(
                    resumeText,
                    job.getTitle(),
                    job.getDescription()
            );

            addFactor(
                    breakdown,
                    weights,
                    "roleScore",
                    score,
                    40
            );
        }

        // 3. Experience: 10%. Skip when there is insufficient evidence.
        Integer experienceScore = calculateExperienceScore(
                candidateText,
                normalize(safe(job.getExperienceLevel()))
        );

        if (experienceScore != null) {
            addFactor(
                    breakdown, weights, "experienceScore",
                    experienceScore, 10
            );
        }

        // 4. Project relevance: optional, 5%.
        // Only score when a project section is detected in the resume.
        String projectText = extractSection(
                resumeText,
                Arrays.asList("projects", "academic projects", "personal projects"),
                Arrays.asList(
                        "certifications", "certificates", "education",
                        "experience", "skills", "achievements"
                )
        );

        if (!projectText.isBlank()) {
            int score = keywordRelevance(jobText, projectText);
            addFactor(breakdown, weights, "projectsScore", score, 5);
        }

        // 5. Education: optional, 10%.
        String educationText = normalize(
                safe(resumeText) + " "
                + (profile == null ? "" :
                    safe(profile.getDegree()) + " "
                    + safe(profile.getBranch()) + " "
                    + safe(profile.getCollege()))
        );

        boolean hasEducation = !normalize(
                (profile == null ? "" :
                    safe(profile.getDegree()) + " "
                    + safe(profile.getBranch()) + " "
                    + safe(profile.getCollege()))
                + " "
                + extractSection(
                    resumeText,
                    Arrays.asList("education", "academic background"),
                    Arrays.asList(
                            "projects", "experience", "skills",
                            "certifications", "achievements"
                    )
                )
        ).isBlank();

        if (hasEducation) {
            Integer educationScore =
                    calculateEducationScore(jobDescriptionText, educationText);

            if (educationScore != null) {
                addFactor(
                        breakdown, weights, "educationScore",
                        educationScore, 10
                );
            }
        }

        // 6. Description relevance: 5%.
        Set<String> descriptionWords = usefulWords(job.getDescription());

        if (!descriptionWords.isEmpty() && !candidateText.isBlank()) {
            int score = keywordRelevance(
                    job.getDescription(), candidateText
            );

            addFactor(
                    breakdown, weights, "descriptionScore", score, 5
            );
        }

        // 7. Certifications: optional, 5%.
        String certificationText = extractSection(
                resumeText,
                Arrays.asList("certifications", "certificates", "licenses"),
                Arrays.asList(
                        "education", "projects", "experience",
                        "skills", "achievements"
                )
        );

        if (!certificationText.isBlank()) {
            int score = keywordRelevance(jobText, certificationText);

            addFactor(
                    breakdown, weights, "certificationsScore", score, 5
            );
        }

        // 8. Location preference: optional, 2%.
        String preferredLocation = profile == null
                ? ""
                : firstNonBlank(
                        profile.getPreferredLocation(),
                        profile.getLocation()
                );

        if (!normalize(preferredLocation).isBlank()) {
            int score = locationScore(
                    preferredLocation, job.getLocation()
            );

            addFactor(
                    breakdown, weights, "locationScore", score, 2
            );
        }

        // Normalize using only available factors.
        int totalWeight = weights.values()
                .stream()
                .mapToInt(Integer::intValue)
                .sum();

        int overallScore = -1;

        if (totalWeight > 0) {
            double weightedTotal = 0;

            for (Map.Entry<String, Integer> entry : weights.entrySet()) {
                int factorScore =
                        (Integer) breakdown.get(entry.getKey());

                weightedTotal += factorScore * entry.getValue();
            }

            overallScore = (int) Math.round(
                    weightedTotal / totalWeight
            );
        }

        List<String> reasons = new ArrayList<>();

        if (!matchedSkills.isEmpty()) {
            reasons.add(
                    matchedSkills.size()
                    + " identified job skills appear in your resume or profile."
            );
        }

        if (!missingSkills.isEmpty()) {
            reasons.add(
                    missingSkills.size()
                    + " identified job skills were not found in your resume or profile."
            );
        }
        
        if (breakdown.containsKey("roleScore")) {
            int roleScore = (Integer) breakdown.get("roleScore");

            if (roleScore >= 70) {
                reasons.add(
                        "Your resume contains strong evidence relevant to this job role."
                );
            } else if (roleScore >= 40) {
                reasons.add(
                        "Your resume contains some evidence relevant to this job role."
                );
            } else {
                reasons.add(
                        "Your resume contains limited evidence for this job role."
                );
            }
        }

        if (breakdown.containsKey("locationScore")) {
            reasons.add(
                    "Your preferred location was compared with the job location."
            );
        }

        if (overallScore < 0) {
            reasons.add(
                    "There is not enough information to calculate a reliable match."
            );
        }
        
        System.out.println("========== JOB MATCH DEBUG ==========");
        System.out.println("Resume text length: "
                + (resumeText == null ? 0 : resumeText.length()));

        System.out.println("Job title: " + job.getTitle());
        System.out.println("Job skills: " + job.getSkills());

        System.out.println("Required skills: " + requiredSkills);
        System.out.println("Matched skills: " + matchedSkills);
        System.out.println("Missing skills: " + missingSkills);

        System.out.println("Match breakdown: " + breakdown);
        System.out.println("Total weight: " + totalWeight);
        System.out.println("Calculated score: " + overallScore);

        System.out.println("=====================================");

        Map<String, Object> result = new LinkedHashMap<>();

        result.put("jobId", job.getId());
        result.put("jobTitle", job.getTitle());
        result.put("company", job.getCompany());
        result.put("jobLocation", job.getLocation());
        result.put("jobType", job.getJobType());
        result.put("experienceLevel", job.getExperienceLevel());

        result.put("jobMatchScore", overallScore);
        result.put("matchedSkills", matchedSkills);
        result.put("missingSkills", missingSkills);
        result.put("requiredSkillCount", requiredSkills.size());

        result.put("matchBreakdown", breakdown);
        result.put("matchReasons", reasons);
        result.put("matchMethod", "weighted keyword matching");

        return result;
    }

    public List<Map<String, Object>> matchAll(
            String resumeText,
            List<Job> jobs) {
        return matchAll(resumeText, null, jobs);
    }

    public List<Map<String, Object>> matchAll(
            String resumeText,
            StudentProfile profile,
            List<Job> jobs) {

        if (jobs == null || jobs.isEmpty()) {
            return new ArrayList<>();
        }

        return jobs.stream()
                .map(job -> match(resumeText, profile, job))
                .sorted(
                    Comparator.comparingInt(
                        (Map<String, Object> result) ->
                            ((Number) result.get("jobMatchScore")).intValue()
                    ).reversed()
                )
                .collect(Collectors.toList());
    }

    private void addFactor(
            Map<String, Object> breakdown,
            Map<String, Integer> weights,
            String key,
            int score,
            int weight) {

        breakdown.put(key, score);
        weights.put(key, weight);
    }

    private Integer calculateExperienceScore(
            String candidateText,
            String level) {

        String candidate = normalize(candidateText);
        String jobLevel = normalize(level);

        if (candidate.isBlank() || jobLevel.isBlank()) {
            return null;
        }

        boolean fresher =
                containsPhrase(candidate, "fresher")
                || containsPhrase(candidate, "entry level")
                || containsPhrase(candidate, "recent graduate");

        boolean internship =
                containsPhrase(candidate, "internship")
                || containsPhrase(candidate, "intern");

        // Extract explicit experience, e.g. "2 years of experience".
        java.util.regex.Matcher matcher = Pattern.compile(
                "\\b(\\d+(?:\\.\\d+)?)\\s*\\+?\\s*(?:years?|yrs?)\\b"
        ).matcher(candidate);

        Double candidateYears = null;

        while (matcher.find()) {
            double years = Double.parseDouble(matcher.group(1));

            if (candidateYears == null || years > candidateYears) {
                candidateYears = years;
            }
        }

        boolean hasExperienceEvidence =
                candidateYears != null
                || fresher
                || internship
                || containsPhrase(candidate, "work experience")
                || containsPhrase(candidate, "professional experience");

        // Missing evidence should not be treated as zero experience.
        if (!hasExperienceEvidence) {
            return null;
        }

        if (jobLevel.contains("fresher")
                || jobLevel.contains("entry level")) {
            return fresher || internship ? 100
                    : candidateYears != null && candidateYears == 0 ? 100
                    : 60;
        }

        // Parse ranges such as "1-3 years" and "0-2 years".
        java.util.regex.Matcher rangeMatcher = Pattern.compile(
                "\\b(\\d+(?:\\.\\d+)?)\\s*[-–to]+\\s*(\\d+(?:\\.\\d+)?)\\s*(?:years?|yrs?)\\b"
        ).matcher(jobLevel);

        double minYears;
        double maxYears;

        if (rangeMatcher.find()) {
            minYears = Double.parseDouble(rangeMatcher.group(1));
            maxYears = Double.parseDouble(rangeMatcher.group(2));
        } else {
            // Parse levels such as "5+ years" or "2 years".
            java.util.regex.Matcher singleMatcher = Pattern.compile(
                    "\\b(\\d+(?:\\.\\d+)?)\\s*(\\+)?\\s*(?:years?|yrs?)\\b"
            ).matcher(jobLevel);

            if (!singleMatcher.find()) {
                if (jobLevel.contains("zero_to_one")
                        || jobLevel.contains("one_to_three")
                        || jobLevel.contains("three_to_five")
                        || jobLevel.contains("five_plus")) {
                    return candidateYears == null
                            ? 60
                            : 80;
                }

                return null;
            }

            minYears = Double.parseDouble(singleMatcher.group(1));

            if (singleMatcher.group(2) != null) {
                maxYears = Double.POSITIVE_INFINITY;
            } else {
                maxYears = minYears;
            }
        }

        if (candidateYears == null) {
            return fresher || internship ? 70 : 60;
        }

        if (candidateYears >= minYears && candidateYears <= maxYears) {
            return 100;
        }

        if (candidateYears < minYears) {
            return minYears == 0 ? 100 : 60;
        }

        return 75;
    }

    private Integer calculateEducationScore(
            String jobDescription,
            String candidateEducation) {

        List<String> educationTerms = Arrays.asList(
                "bachelor", "b.tech", "btech", "b.e",
                "master", "m.tech", "mtech", "degree",
                "computer science", "information technology",
                "diploma", "graduate", "postgraduate"
        );

        List<String> jobTerms = educationTerms.stream()
                .filter(term -> containsPhrase(jobDescription, term))
                .toList();

        if (jobTerms.isEmpty()) {
            return null;
        }

        long matches = jobTerms.stream()
                .filter(term -> containsPhrase(candidateEducation, term))
                .count();

        return (int) Math.round(matches * 100.0 / jobTerms.size());
    }

    private int locationScore(String preferred, String jobLocation) {
        String preference = normalize(preferred);
        String location = normalize(jobLocation);

        if (location.isBlank()) {
            return 50;
        }

        if (preference.equals(location)
                || location.contains(preference)
                || preference.contains(location)) {
            return 100;
        }

        if (containsPhrase(preference, "remote")
                && containsPhrase(location, "remote")) {
            return 100;
        }

        return 0;
    }

    private String extractSection(
            String text,
            List<String> headings,
            List<String> endHeadings) {

        if (text == null || text.isBlank()) {
            return "";
        }

        String[] lines = text.split("\\R");
        StringBuilder section = new StringBuilder();
        boolean capturing = false;

        for (String line : lines) {
            String normalizedLine = normalize(line);

            if (!capturing) {
                for (String heading : headings) {
                    if (normalizedLine.equals(normalize(heading))) {
                        capturing = true;
                        break;
                    }
                }
                continue;
            }

            boolean isEndHeading = false;

            for (String heading : endHeadings) {
                if (normalizedLine.equals(normalize(heading))) {
                    isEndHeading = true;
                    break;
                }
            }

            if (isEndHeading) {
                break;
            }

            section.append(line).append(' ');
        }

        return section.toString().trim();
    }

    private int keywordRelevance(String target, String source) {
        Set<String> targetWords = usefulWords(target);
        Set<String> sourceWords = usefulWords(source);

        if (targetWords.isEmpty() || sourceWords.isEmpty()) {
            return 0;
        }

        long matches = targetWords.stream()
                .filter(sourceWords::contains)
                .count();

        return (int) Math.round(
                matches * 100.0 / targetWords.size()
        );
    }

    private Set<String> usefulWords(String value) {
        Set<String> words = new LinkedHashSet<>();

        for (String word : normalize(value).split("\\s+")) {
            if (word.length() > 2 && !STOP_WORDS.contains(word)) {
                words.add(word);
            }
        }

        return words;
    }

    private boolean containsSkill(String text, String skill) {
        return containsPhrase(text, skill);
    }

    private boolean containsPhrase(String text, String phrase) {
        String normalizedText = normalize(text);
        String normalizedPhrase = normalize(phrase);

        if (normalizedPhrase.isBlank()) {
            return false;
        }

        String regex = "(^| )"
                + Pattern.quote(normalizedPhrase)
                + "( |$)";

        return Pattern.compile(regex).matcher(normalizedText).find();
    }

    private String firstNonBlank(String first, String second) {
        if (first != null && !first.isBlank()) {
            return first;
        }

        return second == null ? "" : second;
    }

    private String normalize(String value) {
        return value == null ? "" : value
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9+#.]+", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }


private int calculateResumeRoleScore(
        String resumeText,
        String jobTitle,
        String jobDescription) {

    String resume = normalize(resumeText);
    String title = normalize(jobTitle);

    if (resume.isBlank() || title.isBlank()) {
        return 0;
    }

    // Identify the role from the job title, not the student profile.
    String role;

    if (title.contains("full stack") || title.contains("fullstack")) {
        role = "fullstack";
    } else if (title.contains("data analyst")
            || title.contains("business analyst")
            || title.equals("analyst")) {
        role = "data";
    } else if (title.contains("react")
            || title.contains("frontend")
            || title.contains("front end")) {
        role = "frontend";
    } else if (title.contains("java")) {
        role = "java";
    } else if (title.contains("python")
            && !title.contains("data analyst")) {
        role = "python";
    } else if (title.contains("devops")
            || title.contains("dev ops")) {
        role = "devops";
    } else if (title.contains("qa")
            || title.contains("quality assurance")
            || title.contains("test engineer")) {
        role = "qa";
    } else {
        // Unknown roles should not receive an invented high score.
        return calculateGenericRoleScore(resume, title);
    }

    Map<String, List<String>> keywords = new LinkedHashMap<>();

    keywords.put("data", Arrays.asList(
            "data analyst", "data analysis", "data analytics",
            "power bi", "tableau", "excel", "pandas", "numpy",
            "data visualization", "business intelligence",
            "reporting", "statistics", "sql", "pl/sql"
    ));

    keywords.put("java", Arrays.asList(
            "java", "spring boot", "spring mvc", "hibernate",
            "jpa", "spring security", "maven", "microservices",
            "rest api"
    ));

    keywords.put("frontend", Arrays.asList(
            "react", "react.js", "jsx", "javascript",
            "typescript", "html", "css", "frontend", "front end"
    ));

    keywords.put("python", Arrays.asList(
            "python", "django", "flask", "fastapi"
    ));

    keywords.put("fullstack", Arrays.asList(
            "java", "spring boot", "node.js", "express",
            "react", "javascript", "html", "css",
            "rest api", "mysql", "postgresql"
    ));

    keywords.put("devops", Arrays.asList(
            "docker", "kubernetes", "jenkins", "ci/cd",
            "aws", "deployment", "devops"
    ));

    keywords.put("qa", Arrays.asList(
            "software testing", "test cases", "selenium",
            "automation testing", "manual testing",
            "junit", "quality assurance"
    ));

    List<String> roleTerms = keywords.get(role);

    // Extract evidence from meaningful resume sections.
    String summaryText = extractSection(
            resumeText,
            Arrays.asList(
                    "summary", "professional summary",
                    "career objective", "objective", "profile"
            ),
            Arrays.asList(
                    "skills", "technical skills", "experience",
                    "work experience", "professional experience",
                    "projects", "education", "certifications"
            )
    );

    String experienceText = extractSection(
            resumeText,
            Arrays.asList(
                    "experience", "work experience",
                    "professional experience", "employment history"
            ),
            Arrays.asList(
                    "projects", "academic projects",
                    "personal projects", "education", "skills",
                    "technical skills", "certifications", "achievements"
            )
    );

    String projectText = extractSection(
            resumeText,
            Arrays.asList(
                    "projects", "academic projects", "personal projects"
            ),
            Arrays.asList(
                    "education", "experience", "work experience",
                    "skills", "technical skills", "certifications",
                    "achievements"
            )
    );

    String strongEvidence = normalize(
            summaryText + " " + experienceText + " " + projectText
    );

    // Some resume parsers do not preserve headings. Avoid losing
    // all evidence when sections cannot be extracted.
    if (strongEvidence.isBlank()) {
        strongEvidence = resume;
    }

    int totalMatches = 0;
    int strongMatches = 0;

    for (String keyword : roleTerms) {
        if (containsPhrase(resume, keyword)) {
            totalMatches++;
        }

        if (containsPhrase(strongEvidence, keyword)) {
            strongMatches++;
        }
    }

    double overallEvidence =
            totalMatches * 100.0 / roleTerms.size();

    double strongEvidenceScore =
            strongMatches * 100.0 / roleTerms.size();

    // Summary, work experience and projects contribute more
    // than a keyword appearing only somewhere in the resume.
    int score = (int) Math.round(
            overallEvidence * 0.35
            + strongEvidenceScore * 0.65
    );

    return Math.min(100, score);
}

private int calculateGenericRoleScore(
        String resume,
        String jobTitle) {

    Set<String> titleWords = usefulWords(jobTitle);
    Set<String> resumeWords = usefulWords(resume);

    if (titleWords.isEmpty()) {
        return 0;
    }

    long matches = titleWords.stream()
            .filter(resumeWords::contains)
            .count();

    return (int) Math.round(
            matches * 100.0 / titleWords.size()
    );
}

}
