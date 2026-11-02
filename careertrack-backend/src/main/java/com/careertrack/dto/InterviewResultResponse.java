
package com.careertrack.dto;

public class InterviewResultResponse {

    private Long sessionId;
    private String topic;
    private String experienceLevel;
    private String difficulty;

    private Integer totalQuestions;
    private Integer attemptedQuestions;

    private Integer correctAnswers;
    private Integer wrongAnswers;

    private Integer totalScore;
    private Integer maxScore;
    private Double percentage;

    private String status;

    public InterviewResultResponse() {
    }

    public InterviewResultResponse(
            Long sessionId,
            String topic,
            String experienceLevel,
            String difficulty,
            Integer totalQuestions,
            Integer attemptedQuestions,
            Integer totalScore,
            Integer maxScore,
            Double percentage,
            String status,
            Integer correctAnswers,
            Integer wrongAnswers) {

        this.sessionId = sessionId;
        this.topic = topic;
        this.experienceLevel = experienceLevel;
        this.difficulty = difficulty;
        this.totalQuestions = totalQuestions;
        this.attemptedQuestions = attemptedQuestions;
        this.totalScore = totalScore;
        this.maxScore = maxScore;
        this.percentage = percentage;
        this.status = status;
        this.correctAnswers = correctAnswers;
        this.wrongAnswers = wrongAnswers;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getAttemptedQuestions() {
        return attemptedQuestions;
    }

    public void setAttemptedQuestions(Integer attemptedQuestions) {
        this.attemptedQuestions = attemptedQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getWrongAnswers() {
        return wrongAnswers;
    }

    public void setWrongAnswers(Integer wrongAnswers) {
        this.wrongAnswers = wrongAnswers;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public Integer getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
