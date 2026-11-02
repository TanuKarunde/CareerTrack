package com.careertrack.dto;

import java.util.List;

public class InterviewQuestionResponse {

    private Long id;

    private String question;

    private String questionType;

    private String difficulty;

    private String skill;

    private List<String> options;

    private Integer maxScore;


    public InterviewQuestionResponse() {
    }


    public InterviewQuestionResponse(
            Long id,
            String question,
            String questionType,
            String difficulty,
            String skill,
            List<String> options,
            Integer maxScore) {

        this.id = id;
        this.question = question;
        this.questionType = questionType;
        this.difficulty = difficulty;
        this.skill = skill;
        this.options = options;
        this.maxScore = maxScore;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }


    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }


    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }


    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }


    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }


    public Integer getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }
}