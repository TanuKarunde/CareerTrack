
package com.careertrack.dto;

import java.util.List;

public record AIAssessmentResponse(
        List<AIQuestion> questions
) {
    public record AIQuestion(
            String topic,
            String question,
            List<String> options,
            String correctAnswer,
            Integer marks
    ) {
    }
}
