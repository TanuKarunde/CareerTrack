package com.careertrack.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;

public class JobReadinessResponse {

    private Long reportId;
    private Long studentId;
    private Long jobId;
    private String jobTitle;

    private Integer readinessScore;
    private Integer skillMatchScore;
    private Integer projectScore;
    private Integer profileScore;
    private Integer criteriaScore;
    
    private Integer experienceScore;

    private Integer educationScore;

    private Integer aboutScore;

    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> suggestions;

    private LocalDateTime createdAt;

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public Integer getReadinessScore() {
        return readinessScore;
    }

    public void setReadinessScore(Integer readinessScore) {
        this.readinessScore = readinessScore;
    }

    public Integer getSkillMatchScore() {
        return skillMatchScore;
    }

    public void setSkillMatchScore(Integer skillMatchScore) {
        this.skillMatchScore = skillMatchScore;
    }

    public Integer getProjectScore() {
        return projectScore;
    }

    public void setProjectScore(Integer projectScore) {
        this.projectScore = projectScore;
    }

    public Integer getProfileScore() {
        return profileScore;
    }

    public void setProfileScore(Integer profileScore) {
        this.profileScore = profileScore;
    }

    public Integer getCriteriaScore() {
        return criteriaScore;
    }

    public void setCriteriaScore(Integer criteriaScore) {
        this.criteriaScore = criteriaScore;
    }
    
    public Integer getExperienceScore() {
        return experienceScore;
    }

    public void setExperienceScore(Integer experienceScore) {
        this.experienceScore = experienceScore;
    }

    public Integer getEducationScore() {
        return educationScore;
    }

    public void setEducationScore(Integer educationScore) {
        this.educationScore = educationScore;
    }

    public Integer getAboutScore() {
        return aboutScore;
    }

    public void setAboutScore(Integer aboutScore) {
        this.aboutScore = aboutScore;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
