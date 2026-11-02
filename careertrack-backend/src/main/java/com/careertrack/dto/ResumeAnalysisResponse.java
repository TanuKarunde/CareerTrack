package com.careertrack.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class ResumeAnalysisResponse {

    private Long id;
    private String resumeName;
    private Integer overallScore;
    private Integer atsScore;
    private Integer skillsScore;
    private Integer projectsScore;
    private Integer educationScore;
    private Integer experienceScore;

    private Integer jobMatchScore;
    private String jobTitle;

    private List<String> matchedSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();
    private List<Map<String, Object>> recommendedJobs = new ArrayList<>();
    private List<String> strengths = new ArrayList<>();
    private List<String> improvements = new ArrayList<>();

    private Map<String, Object> extractedDetails =
            new LinkedHashMap<>();

    private String aiFeedback;
    private String source;
    private LocalDateTime analyzedAt;

    public ResumeAnalysisResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getResumeName() { return resumeName; }
    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) {
        this.overallScore = overallScore;
    }

    public Integer getAtsScore() { return atsScore; }
    public void setAtsScore(Integer atsScore) {
        this.atsScore = atsScore;
    }

    public Integer getSkillsScore() { return skillsScore; }
    public void setSkillsScore(Integer skillsScore) {
        this.skillsScore = skillsScore;
    }

    public Integer getProjectsScore() { return projectsScore; }
    public void setProjectsScore(Integer projectsScore) {
        this.projectsScore = projectsScore;
    }

    public Integer getEducationScore() { return educationScore; }
    public void setEducationScore(Integer educationScore) {
        this.educationScore = educationScore;
    }

    public Integer getExperienceScore() { return experienceScore; }
    public void setExperienceScore(Integer experienceScore) {
        this.experienceScore = experienceScore;
    }

    public Integer getJobMatchScore() { return jobMatchScore; }
    public void setJobMatchScore(Integer jobMatchScore) {
        this.jobMatchScore = jobMatchScore;
    }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public List<String> getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }
    
    public List<Map<String, Object>> getRecommendedJobs() {
        return recommendedJobs;
    }

    public void setRecommendedJobs(
            List<Map<String, Object>> recommendedJobs) {
        this.recommendedJobs = recommendedJobs;
    }

    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getImprovements() { return improvements; }
    public void setImprovements(List<String> improvements) {
        this.improvements = improvements;
    }

    public Map<String, Object> getExtractedDetails() {
        return extractedDetails;
    }

    public void setExtractedDetails(
            Map<String, Object> extractedDetails) {
        this.extractedDetails = extractedDetails;
    }

    public String getAiFeedback() { return aiFeedback; }
    public void setAiFeedback(String aiFeedback) {
        this.aiFeedback = aiFeedback;
    }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public LocalDateTime getAnalyzedAt() { return analyzedAt; }
    public void setAnalyzedAt(LocalDateTime analyzedAt) {
        this.analyzedAt = analyzedAt;
    }
}