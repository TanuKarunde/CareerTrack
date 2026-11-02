package com.careertrack.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Logged-in student
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    /*
     * Selected preparation topic
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private InterviewTopic topic;
    
    @ManyToMany
    @JoinTable(
        name = "interview_session_skills",
        joinColumns = @JoinColumn(name = "session_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private List<InterviewSkill> skills = new ArrayList<>();

    /*
     * Fresher / 0-1 / 1-3 etc.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExperienceLevel experienceLevel;

    /*
     * Easy / Medium / Hard / Adaptive
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DifficultyLevel difficulty;

    /*
     * Number of questions requested
     */
    @Column(nullable = false)
    private Integer totalQuestions;

    /*
     * Score obtained
     */
    @Column(nullable = false)
    private Integer totalScore = 0;

    /*
     * Maximum possible score
     */
    @Column(nullable = false)
    private Integer maxScore = 0;

    /*
     * Final percentage
     */
    @Column(nullable = false)
    private Double percentage = 0.0;

    /*
     * Session status
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status = SessionStatus.IN_PROGRESS;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    public InterviewSession() {
    }

    @PrePersist
    public void onCreate() {

        if (startedAt == null) {
            startedAt = LocalDateTime.now();
        }

        if (totalScore == null) {
            totalScore = 0;
        }

        if (maxScore == null) {
            maxScore = 0;
        }

        if (percentage == null) {
            percentage = 0.0;
        }

        if (status == null) {
            status = SessionStatus.IN_PROGRESS;
        }
    }

    public Long getId() {
        return id;
    }

    public User getStudent() {
        return student;
    }

    public InterviewTopic getTopic() {
        return topic;
    }

    public ExperienceLevel getExperienceLevel() {
        return experienceLevel;
    }

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public Integer getMaxScore() {
        return maxScore;
    }

    public Double getPercentage() {
        return percentage;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public void setTopic(InterviewTopic topic) {
        this.topic = topic;
    }
    
    public List<InterviewSkill> getSkills() {
        return skills;
    }

    public void setSkills(List<InterviewSkill> skills) {
        this.skills = skills;
    }

    public void setExperienceLevel(ExperienceLevel experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}