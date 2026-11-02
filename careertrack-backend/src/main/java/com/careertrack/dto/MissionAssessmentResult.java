
package com.careertrack.dto;

public record MissionAssessmentResult(
        Long missionId,
        Integer score,
        Integer totalMarks,
        Double percentage,
        Long timeTakenSeconds,
        boolean passed,
        String status,
        Integer xpAwarded,
        String message,
        Integer attemptedCount,
        Integer skippedCount,
        Integer correctCount,
        Integer wrongCount
) {}
