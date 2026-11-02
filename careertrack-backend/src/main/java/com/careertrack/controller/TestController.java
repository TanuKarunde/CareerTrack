package com.careertrack.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

	@GetMapping("/api/test")
	public String text(Authentication authentication) {
		
		return "Welcome " + authentication.getName() + " ! JWT authentication is working";
	}
}
