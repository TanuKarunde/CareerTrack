package com.careertrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.InterviewTopic;

public interface InterviewTopicRepository
        extends JpaRepository<InterviewTopic, Long> {

    List<InterviewTopic> findByActiveTrueOrderByIdAsc();

    Optional<InterviewTopic> findByNameIgnoreCase(String name);
}