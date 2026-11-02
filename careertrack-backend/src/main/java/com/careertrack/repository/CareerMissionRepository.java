
package com.careertrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.CareerMission;

public interface CareerMissionRepository
        extends JpaRepository<CareerMission, Long> {

    List<CareerMission>
    findByStudentIdAndJobIdOrderByCreatedAtDesc(
            Long studentId,
            Long jobId
    );

    List<CareerMission>
    findByStudentIdOrderByCreatedAtDesc(
            Long studentId
    );

    boolean existsByStudentIdAndJobIdAndReadinessReportId(
            Long studentId,
            Long jobId,
            Long readinessReportId
    );
}
