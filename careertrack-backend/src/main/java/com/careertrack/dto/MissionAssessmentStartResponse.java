
package com.careertrack.dto;

import java.time.LocalDateTime;
import java.util.List;

public record MissionAssessmentStartResponse(
        Long missionId,
        String title,
        String description,
        LocalDateTime startedAt,
        Integer durationSeconds,
        Integer questionCount,
        List<Question> questions
) {
    public record Question(
            Integer questionId,
            String topic,
            String question,
            List<String> options,
            Integer marks
    ) {}
}
