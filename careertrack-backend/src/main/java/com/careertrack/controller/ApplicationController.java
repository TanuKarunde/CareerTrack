package com.careertrack.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.careertrack.dto.ApplicationResponse;
import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;
import com.careertrack.service.ApplicationService;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationService applicationService;

    private final UserRepository userRepository;

    public ApplicationController(
            ApplicationService applicationService,
            UserRepository userRepository) {

        this.applicationService = applicationService;
        this.userRepository = userRepository;
    }


    // =====================================================
    // APPLY FOR JOB
    // =====================================================

    @PostMapping(
    	    value = "/{jobId}",
    	    consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE
    	)
    	@PreAuthorize("hasRole('STUDENT')")
    	public ResponseEntity<ApplicationResponse> applyForJob(
    	        @PathVariable Long jobId,
    	        @RequestParam(required = false) MultipartFile resume,
    	        @RequestParam(defaultValue = "true") boolean useProfileResume,
    	        Authentication authentication) {

    	    String email = authentication.getName();

    	    User student = userRepository.findByEmail(email)
    	            .orElseThrow(() ->
    	                    new RuntimeException("User not found"));

    	    ApplicationResponse response =
    	            applicationService.applyForJob(
    	                    jobId,
    	                    student,
    	                    resume,
    	                    useProfileResume
    	            );

    	    return ResponseEntity.ok(response);
    	}


    // =====================================================
    // GET MY APPLICATIONS
    // =====================================================

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ApplicationResponse>> getMyApplication(
            Authentication authentication) {

        String email = authentication.getName();

        User student = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Student not found")
                );

        return ResponseEntity.ok(
                applicationService.getStudentApplications(
                        student
                )
        );
    }


    // =====================================================
    // GET APPLICATION BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return ResponseEntity.ok(
                applicationService.getApplication(
                        id,
                        user
                )
        );
    }


    // =====================================================
    // APPLICATION ERROR HANDLER
    // =====================================================

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleApplicationException(
            RuntimeException ex) {

        Map<String, String> response =
                new HashMap<>();

        String message = ex.getMessage();

        if (message == null ||
                message.trim().isEmpty()) {

            message = "Unable to process application";
        }

        response.put("message", message);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
}