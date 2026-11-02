package com.careertrack.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careertrack.dto.LoginRequest;
import com.careertrack.dto.LoginResponse;
import com.careertrack.dto.RegisterRequest;
import com.careertrack.dto.RegisterResponse;
import com.careertrack.entity.User;
import com.careertrack.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

	private final AuthService authService;
	
	public AuthController(AuthService authService) {
		this.authService = authService;
	}
	
	@PostMapping("/register")
		public ResponseEntity<RegisterResponse> register(
				@Valid @RequestBody 
				RegisterRequest request){
		
		User user = authService.register(request);
		
		RegisterResponse response = new RegisterResponse(
				user.getId(),
				user.getName(),
				user.getEmail(), 
				user.getRole());
		
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
		
	}
	
	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(
			@Valid @RequestBody LoginRequest request){
		
		
		
		LoginResponse response = authService.login(request);
		
		return ResponseEntity.ok(response);
	}
	
}
