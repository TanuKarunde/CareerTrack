package com.careertrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.JobReadinessReport;

public interface JobReadinessReportRepository
        extends JpaRepository<JobReadinessReport, Long> {

    Optional<JobReadinessReport>
    findTopByStudentIdAndJobIdOrderByCreatedAtDesc(
            Long studentId,
            Long jobId
    );

    List<JobReadinessReport> findByStudentIdOrderByCreatedAtDesc(
            Long studentId
    );
}