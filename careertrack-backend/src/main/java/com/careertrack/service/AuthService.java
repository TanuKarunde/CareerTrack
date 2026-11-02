package com.careertrack.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.careertrack.dto.LoginRequest;
import com.careertrack.dto.LoginResponse;
import com.careertrack.dto.RegisterRequest;
import com.careertrack.entity.Role;
import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;
import com.careertrack.security.JwtService;

@Service
public class AuthService {

	private final UserRepository userRepository;
	
	private final PasswordEncoder passwordEncoder;
	
	private final AuthenticationManager authenticationManager;
	
	private final JwtService jwtService;
	
	public AuthService(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			AuthenticationManager authenticationManager,
			JwtService jwtService)
	{
		
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
	}
	
	//Register
	// Register Student or Employer only
	public User register(RegisterRequest request) {

	    if (userRepository.existsByEmail(request.getEmail())) {
	        throw new RuntimeException("Email already registered");
	    }

	    if (request.getRole() == null ||
	        request.getRole() == Role.ADMIN) {
	        throw new IllegalArgumentException(
	            "Invalid role. Public registration is only for Student or Employer."
	        );
	    }

	    User user = new User();
	    user.setName(request.getName());
	    user.setEmail(request.getEmail());
	    user.setPassword(passwordEncoder.encode(request.getPassword()));
	    user.setRole(request.getRole());

	    return userRepository.save(user);
	}
	
	//login
	public LoginResponse login(LoginRequest request) {
		
		System.out.println("========== LOGIN METHOD CALLED ==========");
	    System.out.println("Email: " + request.getEmail());
		
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
		
		User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
		
		String token = jwtService.generateToken(user);
		
		return new LoginResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
	}
}

