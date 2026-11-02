package com.careertrack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.StudentProfile;

public interface StudentProfileRepository
        extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByUserId(Long userId);

    Optional<StudentProfile> findByUser_Email(String email);
}