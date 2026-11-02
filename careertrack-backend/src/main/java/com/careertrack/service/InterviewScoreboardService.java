package com.careertrack.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.careertrack.dto.ScoreboardResponse;
import com.careertrack.dto.TopicScoreResponse;
import com.careertrack.entity.InterviewSession;
import com.careertrack.entity.SessionStatus;
import com.careertrack.entity.User;
import com.careertrack.repository.InterviewSessionRepository;

@Service
public class InterviewScoreboardService {

    private final InterviewSessionRepository sessionRepository;

    public InterviewScoreboardService(
            InterviewSessionRepository sessionRepository) {

        this.sessionRepository = sessionRepository;
    }

    public ScoreboardResponse getScoreboard(
            User student) {

        List<InterviewSession> sessions =
                sessionRepository
                        .findByStudentIdOrderByStartedAtDesc(
                                student.getId()
                        )
                        .stream()
                        .filter(session ->
                                session.getStatus()
                                        == SessionStatus.COMPLETED)
                        .toList();

        if (sessions.isEmpty()) {

            return new ScoreboardResponse(
                    0,
                    0.0,
                    0.0,
                    new ArrayList<>()
            );
        }

        double average =
                sessions.stream()
                        .mapToDouble(
                                InterviewSession::getPercentage)
                        .average()
                        .orElse(0.0);

        double best =
                sessions.stream()
                        .mapToDouble(
                                InterviewSession::getPercentage)
                        .max()
                        .orElse(0.0);

        Map<Long, List<InterviewSession>>
                groupedByTopic =
                sessions.stream()
                        .collect(
                                Collectors.groupingBy(
                                        session ->
                                                session.getTopic()
                                                        .getId()
                                )
                        );

        List<TopicScoreResponse> topicScores =
                new ArrayList<>();

        for (Map.Entry<Long, List<InterviewSession>> entry :
                groupedByTopic.entrySet()) {

            List<InterviewSession> topicSessions =
                    entry.getValue();

            InterviewSession latest =
                    topicSessions.get(0);

            double topicAverage =
                    topicSessions.stream()
                            .mapToDouble(
                                    InterviewSession::getPercentage)
                            .average()
                            .orElse(0.0);

            double topicBest =
                    topicSessions.stream()
                            .mapToDouble(
                                    InterviewSession::getPercentage)
                            .max()
                            .orElse(0.0);

            topicScores.add(
                    new TopicScoreResponse(
                            latest.getTopic().getId(),
                            latest.getTopic().getName(),
                            topicSessions.size(),
                            topicAverage,
                            topicBest,
                            latest.getPercentage()
                    )
            );
        }

        return new ScoreboardResponse(
                sessions.size(),
                average,
                best,
                topicScores
        );
    }
}