package com.careertrack.dto;

import java.util.Map;

public class SubmitInterviewRequest {

    private Map<Long, String> answers;

    public SubmitInterviewRequest() {
    }

    public Map<Long, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, String> answers) {
        this.answers = answers;
    }
}