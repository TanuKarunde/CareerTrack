package com.careertrack.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careertrack.dto.AIAnswerEvaluation;
import com.careertrack.dto.AnswerEvaluationResponse;
import com.careertrack.dto.InterviewResultResponse;
import com.careertrack.entity.InterviewAnswer;
import com.careertrack.entity.InterviewQuestion;
import com.careertrack.entity.InterviewSession;
import com.careertrack.entity.SessionStatus;
import com.careertrack.repository.InterviewAnswerRepository;
import com.careertrack.repository.InterviewQuestionRepository;
import com.careertrack.repository.InterviewSessionRepository;

@Service
public class InterviewScoringService {

    private final InterviewQuestionRepository questionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final InterviewSessionRepository sessionRepository;
    private final OpenAIInterviewService openAIInterviewService;

    public InterviewScoringService(
            InterviewQuestionRepository questionRepository,
            InterviewAnswerRepository answerRepository,
            InterviewSessionRepository sessionRepository,
            OpenAIInterviewService openAIInterviewService) {

        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.sessionRepository = sessionRepository;
        this.openAIInterviewService = openAIInterviewService;
    }

    @Transactional
    public AnswerEvaluationResponse submitAnswer(
            Long sessionId,
            Long questionId,
            String studentAnswer,
            Long studentId) {

        InterviewSession session =
                sessionRepository.findById(sessionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Interview session not found"
                                )
                        );

        if (!session.getStudent().getId().equals(studentId)) {
            throw new RuntimeException(
                    "You are not allowed to access this interview"
            );
        }

        InterviewQuestion question =
                questionRepository.findById(questionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Question not found"
                                )
                        );

        if (!question.getSession().getId().equals(sessionId)) {
            throw new RuntimeException(
                    "Question does not belong to this session"
            );
        }

        if (studentAnswer == null ||
                studentAnswer.trim().isEmpty()) {

            throw new RuntimeException(
                    "Answer cannot be empty"
            );
        }

        /*
         * Prevent answering the same question twice.
         */
        if (answerRepository
                .findBySessionIdAndQuestionId(
                        sessionId,
                        questionId)
                .isPresent()) {

            throw new RuntimeException(
                    "This question has already been answered"
            );
        }

        AIAnswerEvaluation evaluation =
                openAIInterviewService.evaluateAnswer(
                        question,
                        studentAnswer
                );

        int score = evaluation.getScore();

        /*
         * Safety validation.
         */
        if (score < 0) {
            score = 0;
        }

        if (score > 10) {
            score = 10;
        }

        InterviewAnswer answer =
                new InterviewAnswer();

        answer.setSession(session);
        answer.setQuestion(question);
        answer.setStudentAnswer(studentAnswer);
        answer.setScore(score);
        answer.setMaxScore(question.getMaxScore());
        answer.setAiFeedback(
                evaluation.getFeedback()
        );
        answer.setIdealAnswer(
                evaluation.getIdealAnswer()
        );
        answer.setMissingPoints(
                evaluation.getMissingPoints()
        );

        answerRepository.save(answer);

        /*
         * Recalculate session score.
         */
        int totalScore =
                answerRepository
                        .findBySessionId(sessionId)
                        .stream()
                        .mapToInt(a ->
                                a.getScore() == null
                                        ? 0
                                        : a.getScore())
                        .sum();

        int maxScore =
                answerRepository
                        .findBySessionId(sessionId)
                        .stream()
                        .mapToInt(a ->
                                a.getMaxScore() == null
                                        ? 0
                                        : a.getMaxScore())
                        .sum();

        session.setTotalScore(totalScore);
        session.setMaxScore(maxScore);

        if (maxScore > 0) {

            session.setPercentage(
                    (totalScore * 100.0) / maxScore
            );
        }

        sessionRepository.save(session);

        return new AnswerEvaluationResponse(
                questionId,
                score,
                question.getMaxScore(),
                evaluation.getFeedback(),
                evaluation.getIdealAnswer(),
                evaluation.getMissingPoints()
        );
    }
    
    @Transactional
    public InterviewResultResponse completeInterview(
            Long sessionId,
            Long studentId,
            Map<Long, String> submittedAnswers) {

        InterviewSession session =
                sessionRepository.findById(sessionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Interview session not found"
                                )
                        );

        if (!session.getStudent().getId().equals(studentId)) {

            throw new RuntimeException(
                    "You are not allowed to access this interview"
            );
        }

        if (session.getStatus() == SessionStatus.COMPLETED) {

            return buildResult(session);
        }

        boolean hasAtLeastOneAnswer =
                submittedAnswers != null &&
                submittedAnswers.values()
                        .stream()
                        .anyMatch(answer ->
                                answer != null &&
                                !answer.trim().isEmpty()
                        );

        if (!hasAtLeastOneAnswer) {
            throw new RuntimeException(
                    "Please answer at least one question before completing the interview"
            );
        }

        /*
         * Get all questions belonging to this interview.
         */
        List<InterviewQuestion> questions =
                questionRepository
                        .findBySessionIdOrderByIdAsc(sessionId);

        /*
         * Evaluate and save every submitted answer.
         */
        for (InterviewQuestion question : questions) {

            String studentAnswer =
                    submittedAnswers.get(question.getId());

            /*
             * Skip unanswered questions.
             */
            if (studentAnswer == null ||
                    studentAnswer.trim().isEmpty()) {

                continue;
            }

            /*
             * Prevent duplicate answers if complete
             * request is accidentally sent again.
             */
            if (answerRepository
                    .findBySessionIdAndQuestionId(
                            sessionId,
                            question.getId()
                    )
                    .isPresent()) {

                continue;
            }

            /*
             * Send answer to Gemini for evaluation.
             */
            AIAnswerEvaluation evaluation =
                    openAIInterviewService.evaluateAnswer(
                            question,
                            studentAnswer
                    );

            int score = evaluation.getScore();

            /*
             * Safety validation.
             */
            if (score < 0) {
                score = 0;
            }

            if (score > 10) {
                score = 10;
            }

            /*
             * Create answer record.
             */
            InterviewAnswer answer =
                    new InterviewAnswer();

            answer.setSession(session);
            answer.setQuestion(question);
            answer.setStudentAnswer(studentAnswer);
            answer.setScore(score);
            answer.setMaxScore(question.getMaxScore());

            answer.setAiFeedback(
                    evaluation.getFeedback()
            );

            answer.setIdealAnswer(
                    evaluation.getIdealAnswer()
            );

            answer.setMissingPoints(
                    evaluation.getMissingPoints()
            );

            answerRepository.save(answer);
        }

        /*
         * Get all saved answers after evaluation.
         */
        List<InterviewAnswer> answers =
                answerRepository.findBySessionId(sessionId);

        /*
         * Calculate total score.
         */
        int totalScore =
                answers.stream()
                        .mapToInt(answer ->
                                answer.getScore() == null
                                        ? 0
                                        : answer.getScore()
                        )
                        .sum();

        /*
         * Calculate maximum possible score.
         */
        int maxScore =
                questions.stream()
                        .mapToInt(question ->
                                question.getMaxScore() == null
                                        ? 0
                                        : question.getMaxScore()
                        )
                        .sum();

        /*
         * Calculate percentage.
         */
        double percentage =
                maxScore == 0
                        ? 0.0
                        : (totalScore * 100.0) / maxScore;

        /*
         * Update interview session.
         */
        session.setTotalScore(totalScore);
        session.setMaxScore(maxScore);
        session.setPercentage(percentage);
        session.setStatus(SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());

        sessionRepository.save(session);

        return buildResult(session);
    }
    
    private InterviewResultResponse buildResult(
            InterviewSession session) {

        List<InterviewAnswer> answers =
                answerRepository.findBySessionId(session.getId());

        int attemptedQuestions = answers.size();

        // A score of 70% or more is considered correct.
        int correctAnswers = (int) answers.stream()
                .filter(answer -> {
                    Integer score = answer.getScore();
                    Integer maxScore = answer.getMaxScore();

                    return score != null
                            && maxScore != null
                            && maxScore > 0
                            && (score * 100.0 / maxScore) >= 70.0;
                })
                .count();

        // Attempted answers below 70% are considered wrong.
        int wrongAnswers = attemptedQuestions - correctAnswers;

        return new InterviewResultResponse(
                session.getId(),
                session.getTopic().getName(),
                session.getExperienceLevel().name(),
                session.getDifficulty().name(),
                session.getTotalQuestions(),
                attemptedQuestions,
                session.getTotalScore(),
                session.getMaxScore(),
                session.getPercentage(),
                session.getStatus().name(),
                correctAnswers,
                wrongAnswers
        );
    }
    
    public InterviewResultResponse getResult(
            Long sessionId,
            Long studentId) {

        InterviewSession session =
                sessionRepository.findById(sessionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Interview session not found"
                                )
                        );

        if (!session.getStudent().getId().equals(studentId)) {

            throw new RuntimeException(
                    "You are not allowed to access this interview"
            );
        }

        return buildResult(session);
    }
    

}