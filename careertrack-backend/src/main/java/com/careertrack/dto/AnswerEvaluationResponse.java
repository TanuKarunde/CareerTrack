package com.careertrack.dto;

public class AnswerEvaluationResponse {

    private Long questionId;
    private Integer score;
    private Integer maxScore;
    private String feedback;
    private String idealAnswer;
    private String missingPoints;

    public AnswerEvaluationResponse() {
    }

    public AnswerEvaluationResponse(
            Long questionId,
            Integer score,
            Integer maxScore,
            String feedback,
            String idealAnswer,
            String missingPoints) {

        this.questionId = questionId;
        this.score = score;
        this.maxScore = maxScore;
        this.feedback = feedback;
        this.idealAnswer = idealAnswer;
        this.missingPoints = missingPoints;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
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