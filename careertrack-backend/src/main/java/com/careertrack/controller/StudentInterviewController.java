
package com.careertrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.careertrack.dto.InterviewResponse;
import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;
import com.careertrack.service.InterviewService;

@RestController
@RequestMapping("/api/student/interviews")
@PreAuthorize("hasRole('STUDENT')")
public class StudentInterviewController {

    private final InterviewService interviewService;
    private final UserRepository userRepository;

    public StudentInterviewController(
            InterviewService interviewService,
            UserRepository userRepository) {

        this.interviewService = interviewService;
        this.userRepository = userRepository;
    }

    // Get the logged-in student
    private User getLoggedInStudent(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with email: " + email
                        )
                );
    }

    // Get ALL interviews for the logged-in student
    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getAllStudentInterviews(
            Authentication authentication) {

        User student = getLoggedInStudent(authentication);

        List<InterviewResponse> interviews =
                interviewService.getAllStudentInterviews(
                        student.getId()
                );

        return ResponseEntity.ok(interviews);
    }

    // Get UPCOMING interviews for the logged-in student
    @GetMapping("/upcoming")
    public ResponseEntity<List<InterviewResponse>> getUpcomingInterviews(
            Authentication authentication) {

        User student = getLoggedInStudent(authentication);

        List<InterviewResponse> interviews =
                interviewService.getStudentUpcomingInterviews(
                        student.getId()
                );

        return ResponseEntity.ok(interviews);
    }
}
