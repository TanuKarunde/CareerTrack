package com.careertrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.careertrack.dto.InterviewResponse;
import com.careertrack.dto.ScheduleInterviewRequest;
import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;
import com.careertrack.service.InterviewService;

@RestController
@RequestMapping("/api/employer/interviews")
public class InterviewController {

    private final InterviewService interviewService;
    private final UserRepository userRepository;

    public InterviewController(InterviewService interviewService, UserRepository userRepository) {
        this.interviewService = interviewService;
        this.userRepository = userRepository;
    }
    
 // =====================================================
    // Get logged-in employer
    // =====================================================

    private User getLoggedInEmployer(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employer not found with email: " + email
                        )
                );
    }


    // GET employer's interviews
    @GetMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<InterviewResponse>> getInterviews(
            Authentication authentication) {
    	
    	User employer = getLoggedInEmployer(authentication);

        List<InterviewResponse> interviews =
                interviewService.getEmployerInterviews(employer.getId());

        return ResponseEntity.ok(interviews);
    }

    // Schedule interview
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<InterviewResponse> scheduleInterview(
            @RequestBody ScheduleInterviewRequest request,
            Authentication authentication) {

    	User employer = getLoggedInEmployer(authentication);
    	
        InterviewResponse response =
                interviewService.createInterview(
                        request,
                        employer.getId()
                );

        return ResponseEntity.ok(response);
    }
    
 // Reschedule interview
    @PutMapping("/{interviewId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<InterviewResponse> rescheduleInterview(
            @PathVariable Long interviewId,
            @RequestBody ScheduleInterviewRequest request,
            Authentication authentication) {

        User employer = getLoggedInEmployer(authentication);

        InterviewResponse response =
                interviewService.rescheduleInterview(
                        interviewId,
                        request,
                        employer.getId()
                );

        return ResponseEntity.ok(response);
    }


    // Cancel interview
    @PatchMapping("/{interviewId}/cancel")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<InterviewResponse> cancelInterview(
            @PathVariable Long interviewId,
            Authentication authentication) {

        User employer = getLoggedInEmployer(authentication);

        InterviewResponse response =
                interviewService.cancelInterview(
                        interviewId,
                        employer.getId()
                );

        return ResponseEntity.ok(response);
    }
}