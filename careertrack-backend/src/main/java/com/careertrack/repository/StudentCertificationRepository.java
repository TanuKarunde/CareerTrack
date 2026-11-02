
package com.careertrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.StudentCertification;

public interface StudentCertificationRepository
        extends JpaRepository<StudentCertification, Long> {

    List<StudentCertification> findByStudentProfileId(Long studentProfileId);
}
