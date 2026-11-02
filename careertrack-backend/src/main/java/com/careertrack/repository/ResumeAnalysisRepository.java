package com.careertrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.ResumeAnalysis;

public interface ResumeAnalysisRepository
        extends JpaRepository<ResumeAnalysis, Long> {

    List<ResumeAnalysis> findByStudentProfile_IdOrderByAnalyzedAtDesc(
            Long profileId);

    Optional<ResumeAnalysis> findByIdAndStudentProfile_Id(
            Long id,
            Long profileId);

    // Latest analysis specifically for a job
    Optional<ResumeAnalysis>
    findTopByStudentProfile_User_IdAndJobIdOrderByAnalyzedAtDesc(
            Long studentId,
            Long jobId);

    // Latest analysis for a student, regardless of job
    Optional<ResumeAnalysis>
    findTopByStudentProfile_User_IdOrderByAnalyzedAtDesc(
            Long studentId);
    
    Optional<ResumeAnalysis>
    findTopByStudentProfile_IdAndJobIdOrderByAnalyzedAtDesc(
        Long profileId,
        Long jobId
    );

    Optional<ResumeAnalysis>
    findTopByStudentProfile_IdOrderByAnalyzedAtDesc(
        Long profileId
    );
}