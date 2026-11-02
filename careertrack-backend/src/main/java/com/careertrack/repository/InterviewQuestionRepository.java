package com.careertrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.InterviewQuestion;

public interface InterviewQuestionRepository
        extends JpaRepository<InterviewQuestion, Long> {

    List<InterviewQuestion> findBySessionIdOrderByIdAsc(
            Long sessionId);
}