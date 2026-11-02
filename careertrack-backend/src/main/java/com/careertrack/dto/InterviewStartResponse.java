package com.careertrack.dto;

import com.careertrack.entity.DifficultyLevel;
import com.careertrack.entity.ExperienceLevel;

public class InterviewStartResponse {

    private Long sessionId;

    private String topic;

    private ExperienceLevel experienceLevel;

    private DifficultyLevel difficulty;

    private Integer totalQuestions;

    private String status;

    public InterviewStartResponse() {
    }

    public InterviewStartResponse(
            Long sessionId,
            String topic,
            ExperienceLevel experienceLevel,
            DifficultyLevel difficulty,
            Integer totalQuestions,
            String status) {

        this.sessionId = sessionId;
        this.topic = topic;
        this.experienceLevel = experienceLevel;
        this.difficulty = difficulty;
        this.totalQuestions = totalQuestions;
        this.status = status;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public String getTopic() {
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

    public String getStatus() {
        return status;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public void setTopic(String topic) {
        this.topic = topic;
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

    public void setStatus(String status) {
        this.status = status;
    }
}