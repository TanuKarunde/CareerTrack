
package com.careertrack.dto;

import java.util.List;

public record MissionAssessmentSubmission(
        List<Answer> answers
) {
    public record Answer(
            Integer questionId,
            String selectedOption
    ) {}
}
