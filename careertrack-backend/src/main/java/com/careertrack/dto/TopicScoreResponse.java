package com.careertrack.dto;

public class TopicScoreResponse {

    private Long topicId;
    private String topicName;

    private Integer attempts;

    private Double averageScore;
    private Double bestScore;
    private Double latestScore;

    public TopicScoreResponse() {
    }

    public TopicScoreResponse(
            Long topicId,
            String topicName,
            Integer attempts,
            Double averageScore,
            Double bestScore,
            Double latestScore) {

        this.topicId = topicId;
        this.topicName = topicName;
        this.attempts = attempts;
        this.averageScore = averageScore;
        this.bestScore = bestScore;
        this.latestScore = latestScore;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public Integer getAttempts() {
        return attempts;
    }

    public void setAttempts(Integer attempts) {
        this.attempts = attempts;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public Double getBestScore() {
        return bestScore;
    }

    public void setBestScore(Double bestScore) {
        this.bestScore = bestScore;
    }

    public Double getLatestScore() {
        return latestScore;
    }

    public void setLatestScore(Double latestScore) {
        this.latestScore = latestScore;
    }
}