package com.careertrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.InterviewAnswer;

public interface InterviewAnswerRepository
        extends JpaRepository<InterviewAnswer, Long> {

    List<InterviewAnswer> findBySessionId(Long sessionId);

    Optional<InterviewAnswer> findBySessionIdAndQuestionId(
            Long sessionId,
            Long questionId);
}