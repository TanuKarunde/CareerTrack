package com.careertrack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careertrack.dto.EmployerDashboardResponse;
import com.careertrack.service.EmployerDashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class EmployerDashboardController {

	private final EmployerDashboardService dashboardService;
		
		public EmployerDashboardController(EmployerDashboardService dashboardService) {
			
			this.dashboardService = dashboardService;
		}
	
		@GetMapping("/employer")
		public ResponseEntity<EmployerDashboardResponse> getEmployerDashboard( Authentication authentication){
			
			String email = authentication.getName();
			
			return ResponseEntity.ok(dashboardService.getDashboard(email));
		}
}
