package com.careertrack.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "resume_analyses")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @Column(name = "job_id")
    private Long jobId;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "resume_name")
    private String resumeName;

    @Column(nullable = false, length = 30)
    private String source;

    private Integer overallScore;
    private Integer atsScore;
    private Integer skillsScore;
    private Integer projectsScore;
    private Integer educationScore;
    private Integer experienceScore;
    private Integer jobMatchScore;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String reportJson;

    private LocalDateTime analyzedAt;

    @PrePersist
    public void onCreate() {
        if (analyzedAt == null) {
            analyzedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }

    public StudentProfile getStudentProfile() {
        return studentProfile;
    }

    public void setStudentProfile(StudentProfile studentProfile) {
        this.studentProfile = studentProfile;
    }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getResumeName() { return resumeName; }
    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer score) {
        this.overallScore = score;
    }

    public Integer getAtsScore() { return atsScore; }
    public void setAtsScore(Integer score) { this.atsScore = score; }

    public Integer getSkillsScore() { return skillsScore; }
    public void setSkillsScore(Integer score) {
        this.skillsScore = score;
    }

    public Integer getProjectsScore() { return projectsScore; }
    public void setProjectsScore(Integer score) {
        this.projectsScore = score;
    }

    public Integer getEducationScore() { return educationScore; }
    public void setEducationScore(Integer score) {
        this.educationScore = score;
    }

    public Integer getExperienceScore() { return experienceScore; }
    public void setExperienceScore(Integer score) {
        this.experienceScore = score;
    }

    public Integer getJobMatchScore() { return jobMatchScore; }
    public void setJobMatchScore(Integer score) {
        this.jobMatchScore = score;
    }

    public String getReportJson() { return reportJson; }
    public void setReportJson(String reportJson) {
        this.reportJson = reportJson;
    }

    public LocalDateTime getAnalyzedAt() { return analyzedAt; }
}