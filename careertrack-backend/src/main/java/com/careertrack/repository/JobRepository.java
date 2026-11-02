package com.careertrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.Job;
import com.careertrack.entity.User;

public interface JobRepository extends JpaRepository<Job, Long>{

	List<Job> findByActiveTrue();
	
	List<Job> findByEmployerId(Long employerId);
	
	List<Job> findByEmployer(User employer);
	
	List<Job> findByTitleContainingIgnoreCaseAndActiveTrue(String keyword);
	
	List<Job> findByEmployerAndActiveTrue(User employerr);
	
	List<Job> findByEmployerIn(List<User> employers);
	
	long countByEmployer(User employer);
	
	long countByEmployerAndActiveTrue(User employer);
	
	
//	List<Job> findbyLocationContainingIgnoreCaseAndActivetrue(String location);
}
