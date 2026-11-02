package com.careertrack.dto;

import java.util.List;

public class AIQuestionResponse {

    private List<AIQuestion> questions;

    public AIQuestionResponse() {
    }

    public List<AIQuestion> getQuestions() {
        return questions;
    }

    public void setQuestions(List<AIQuestion> questions) {
        this.questions = questions;
    }


    public static class AIQuestion {

        private String question;

        private String questionType;

        private String difficulty;

        private String skill;

        private List<String> options;

        private String correctAnswer;

        private String explanation;


        public AIQuestion() {
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


        public String getCorrectAnswer() {
            return correctAnswer;
        }

        public void setCorrectAnswer(String correctAnswer) {
            this.correctAnswer = correctAnswer;
        }


        public String getExplanation() {
            return explanation;
        }

        public void setExplanation(String explanation) {
            this.explanation = explanation;
        }
    }
}