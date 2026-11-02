package com.careertrack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careertrack.dto.StudentdashboardResponse;
import com.careertrack.service.Studentdashboardservice;

@RestController
@RequestMapping("/api/dashboard")
public class StudentDashboardController {

	private final Studentdashboardservice dashboardservices;
	
	public StudentDashboardController(Studentdashboardservice dashboardservice) {
		
		this.dashboardservices = dashboardservice;
	}
	
	@GetMapping("/student")
	public ResponseEntity<StudentdashboardResponse> getStudentDashboard(Authentication authentication){
		
		String email = authentication.getName();
		
		StudentdashboardResponse dashboard = dashboardservices.getDashboard(email);
		
		return ResponseEntity.ok(dashboard);
	}
}
