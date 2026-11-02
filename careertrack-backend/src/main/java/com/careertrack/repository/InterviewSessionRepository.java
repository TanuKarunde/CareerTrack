package com.careertrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.InterviewSession;
import com.careertrack.entity.User;

public interface InterviewSessionRepository
        extends JpaRepository<InterviewSession, Long> {

    List<InterviewSession> findByStudentOrderByStartedAtDesc(
            User student);

    List<InterviewSession> findByStudentIdOrderByStartedAtDesc(
            Long studentId);
}