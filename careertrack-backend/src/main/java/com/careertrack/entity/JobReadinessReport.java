package com.careertrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_readiness_reports")
public class JobReadinessReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(nullable = false)
    private Integer readinessScore;

    private Integer skillMatchScore;
    private Integer projectScore;
    private Integer profileScore;
    private Integer criteriaScore;
    
    @Column(name = "experience_score")
    private Integer experienceScore;

    @Column(name = "education_score")
    private Integer educationScore;

    @Column(name = "about_score")
    private Integer aboutScore;

    @Column(columnDefinition = "json")
    private String matchedSkills;

    @Column(columnDefinition = "json")
    private String missingSkills;

    @Column(columnDefinition = "json")
    private String reportJson;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public Long getStudentId() { return studentId; }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getJobId() { return jobId; }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Integer getReadinessScore() {
        return readinessScore;
    }

    public void setReadinessScore(Integer score) {
        this.readinessScore = score;
    }

    public Integer getSkillMatchScore() {
        return skillMatchScore;
    }

    public void setSkillMatchScore(Integer score) {
        this.skillMatchScore = score;
    }

    public Integer getProjectScore() {
        return projectScore;
    }

    public void setProjectScore(Integer score) {
        this.projectScore = score;
    }

    public Integer getProfileScore() {
        return profileScore;
    }

    public void setProfileScore(Integer score) {
        this.profileScore = score;
    }

    public Integer getCriteriaScore() {
        return criteriaScore;
    }

    public void setCriteriaScore(Integer score) {
        this.criteriaScore = score;
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

    public String getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(String skills) {
        this.matchedSkills = skills;
    }

    public String getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(String skills) {
        this.missingSkills = skills;
    }

    public String getReportJson() {
        return reportJson;
    }

    public void setReportJson(String reportJson) {
        this.reportJson = reportJson;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
