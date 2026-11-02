
package com.careertrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.StudentProject;

public interface StudentProjectRepository extends JpaRepository<StudentProject, Long> {

    List<StudentProject> findByStudentProfileId(Long studentProfileId);
}

