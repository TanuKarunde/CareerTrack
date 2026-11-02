package com.careertrack.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "interview_answers")
public class InterviewAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Interview session
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    /*
     * Question being answered
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private InterviewQuestion question;

    /*
     * Student's answer
     */
    @Column(columnDefinition = "TEXT")
    private String studentAnswer;

    /*
     * Score given to this answer
     */
    private Integer score;

    /*
     * Maximum score
     */
    private Integer maxScore;

    /*
     * AI-generated feedback
     */
    @Column(columnDefinition = "TEXT")
    private String aiFeedback;

    /*
     * AI-generated ideal answer
     */
    @Column(columnDefinition = "TEXT")
    private String idealAnswer;

    /*
     * Concepts missing from student's answer
     */
    @Column(columnDefinition = "TEXT")
    private String missingPoints;

    private LocalDateTime submittedAt;

    public InterviewAnswer() {
    }

    @PrePersist
    public void onCreate() {

        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public InterviewSession getSession() {
        return session;
    }

    public InterviewQuestion getQuestion() {
        return question;
    }

    public String getStudentAnswer() {
        return studentAnswer;
    }

    public Integer getScore() {
        return score;
    }

    public Integer getMaxScore() {
        return maxScore;
    }

    public String getAiFeedback() {
        return aiFeedback;
    }

    public String getIdealAnswer() {
        return idealAnswer;
    }

    public String getMissingPoints() {
        return missingPoints;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setSession(InterviewSession session) {
        this.session = session;
    }

    public void setQuestion(InterviewQuestion question) {
        this.question = question;
    }

    public void setStudentAnswer(String studentAnswer) {
        this.studentAnswer = studentAnswer;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }

    public void setAiFeedback(String aiFeedback) {
        this.aiFeedback = aiFeedback;
    }

    public void setIdealAnswer(String idealAnswer) {
        this.idealAnswer = idealAnswer;
    }

    public void setMissingPoints(String missingPoints) {
        this.missingPoints = missingPoints;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}