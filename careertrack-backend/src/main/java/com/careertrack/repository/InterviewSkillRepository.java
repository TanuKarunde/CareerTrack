package com.careertrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.InterviewSkill;

public interface InterviewSkillRepository
        extends JpaRepository<InterviewSkill, Long> {

    List<InterviewSkill> findByTopicIdAndActiveTrueOrderByNameAsc(Long topicId);
}