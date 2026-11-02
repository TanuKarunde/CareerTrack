package com.careertrack.dto;

import java.util.List;

public class ScoreboardResponse {

    private Integer totalAttempts;
    private Double overallAverage;
    private Double bestPercentage;

    private List<TopicScoreResponse> topicScores;

    public ScoreboardResponse() {
    }

    public ScoreboardResponse(
            Integer totalAttempts,
            Double overallAverage,
            Double bestPercentage,
            List<TopicScoreResponse> topicScores) {

        this.totalAttempts = totalAttempts;
        this.overallAverage = overallAverage;
        this.bestPercentage = bestPercentage;
        this.topicScores = topicScores;
    }

    public Integer getTotalAttempts() {
        return totalAttempts;
    }

    public void setTotalAttempts(Integer totalAttempts) {
        this.totalAttempts = totalAttempts;
    }

    public Double getOverallAverage() {
        return overallAverage;
    }

    public void setOverallAverage(Double overallAverage) {
        this.overallAverage = overallAverage;
    }

    public Double getBestPercentage() {
        return bestPercentage;
    }

    public void setBestPercentage(Double bestPercentage) {
        this.bestPercentage = bestPercentage;
    }

    public List<TopicScoreResponse> getTopicScores() {
        return topicScores;
    }

    public void setTopicScores(
            List<TopicScoreResponse> topicScores) {

        this.topicScores = topicScores;
    }
}