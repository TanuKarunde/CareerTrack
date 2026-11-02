package com.careertrack.dto;

public class AIAnswerEvaluation {

    private Integer score;
    private String feedback;
    private String idealAnswer;
    private String missingPoints;

    public AIAnswerEvaluation() {
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public String getIdealAnswer() {
        return idealAnswer;
    }

    public void setIdealAnswer(String idealAnswer) {
        this.idealAnswer = idealAnswer;
    }

    public String getMissingPoints() {
        return missingPoints;
    }

    public void setMissingPoints(String missingPoints) {
        this.missingPoints = missingPoints;
    }
}