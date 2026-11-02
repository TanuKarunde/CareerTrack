
package com.careertrack.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "career_missions")
public class CareerMission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(name = "readiness_report_id")
    private Long readinessReportId;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "mission_type", nullable = false, length = 40)
    private String missionType;

    @Column(name = "target_skill", length = 100)
    private String targetSkill;

    @Column(nullable = false)
    private Integer estimatedMinutes;

    @Column(nullable = false)
    private Integer xpReward;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MissionStatus status = MissionStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = MissionStatus.PENDING;
        }
    }
    

    // Assessment data
    @JsonIgnore
    @Column(name = "assessment_json", columnDefinition = "TEXT")
    private String assessmentJson;

    @Column(name = "score")
    private Integer score;

    @Column(name = "total_marks")
    private Integer totalMarks;

    @Column(name = "time_taken_seconds")
    private Long timeTakenSeconds;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "xp_awarded", nullable = false)
    private Integer xpAwarded = 0;

    public String getAssessmentJson() {
        return assessmentJson;
    }

    public void setAssessmentJson(String assessmentJson) {
        this.assessmentJson = assessmentJson;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Long getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(Long timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Integer getXpAwarded() {
        return xpAwarded;
    }

    public void setXpAwarded(Integer xpAwarded) {
        this.xpAwarded = xpAwarded;
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

    public Long getReadinessReportId() {
        return readinessReportId;
    }
    public void setReadinessReportId(Long id) {
        this.readinessReportId = id;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getMissionType() { return missionType; }
    public void setMissionType(String missionType) {
        this.missionType = missionType;
    }

    public String getTargetSkill() { return targetSkill; }
    public void setTargetSkill(String targetSkill) {
        this.targetSkill = targetSkill;
    }

    public Integer getEstimatedMinutes() {
        return estimatedMinutes;
    }
    public void setEstimatedMinutes(Integer minutes) {
        this.estimatedMinutes = minutes;
    }

    public Integer getXpReward() { return xpReward; }
    public void setXpReward(Integer xpReward) {
        this.xpReward = xpReward;
    }

    public MissionStatus getStatus() { return status; }
    public void setStatus(MissionStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
