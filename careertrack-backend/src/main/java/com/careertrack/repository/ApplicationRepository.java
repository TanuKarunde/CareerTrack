package com.careertrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.Application;
import com.careertrack.entity.User;

public interface ApplicationRepository extends JpaRepository<Application, Long>{

	boolean existsByJobIdAndStudentId(Long jobId, Long studentId);
	
	List<Application> findByStudentIdOrderByAppliedAtDesc(Long studentId);
	
	List<Application> findByJobIdOrderByAppliedAtDesc(Long jobId);
	
	List<Application> findByJobEmployerIdOrderByAppliedAtDesc(Long employerId);
	
	List<Application> findByJobEmployerInOrderByAppliedAtDesc(
	        List<User> employers
	);
	
	Optional<Application> findByJobIdAndStudentId(Long jobId, Long studentId);
	
	
	//List<Application> findByJobEmployerId(Long employerId);
}
