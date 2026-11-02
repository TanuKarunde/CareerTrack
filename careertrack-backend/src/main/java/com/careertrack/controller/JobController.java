package com.careertrack.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.careertrack.dto.JobRequest;
import com.careertrack.dto.JobResponce;
import com.careertrack.entity.Job;
import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;
import com.careertrack.service.JobService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    private final JobService jobService;
    private final UserRepository userRepository;

    public JobController(JobService jobService, UserRepository userRepository) {
        this.jobService = jobService;
        this.userRepository = userRepository;
    }

    // =========================================================
    // Get logged-in employer from database
    // =========================================================
    private User getLoggedInEmployer(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("Employer not found with email: " + email)
                );
    }

    // =========================================================
    // Employer create job
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobResponce> createJob(
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {

        User employer = getLoggedInEmployer(authentication);

        JobResponce responce = jobService.createJob(request, employer);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(responce);
    }

    // =========================================================
    // Get employer's jobs
    // =========================================================

    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<JobResponce>> getEmployerJobs(
            Authentication authentication) {

        User employer = getLoggedInEmployer(authentication);

        return ResponseEntity.ok(
                jobService.getEmployerJobs(employer)
        );
    }

    // =========================================================
    // Update job
    // =========================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobResponce> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {

        User employer = getLoggedInEmployer(authentication);

        JobResponce responce =
                jobService.updateJob(id, request, employer);

        return ResponseEntity.ok(responce);
    }

    // =========================================================
    // Update job status
    // =========================================================

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobResponce> updateJobStatus(
            @PathVariable Long id,
            @RequestParam boolean active,
            Authentication authentication) {

        User employer = getLoggedInEmployer(authentication);

        JobResponce responce =
                jobService.updateJobStatus(id, active, employer);

        return ResponseEntity.ok(responce);
    }

    // =========================================================
    // Student view all jobs
    // =========================================================

    @GetMapping
    public ResponseEntity<List<JobResponce>> getAllJobs() {

        return ResponseEntity.ok(
                jobService.getAllJobs()
        );
    }

 // =========================================================
 // Search jobs
 // =========================================================

 @GetMapping("/search")
 public ResponseEntity<List<JobResponce>> searchJob(
         @RequestParam String keyword) {

     return ResponseEntity.ok(
             jobService.searchJobs(keyword)
     );
 }

 // =========================================================
 // View one job
 // =========================================================

 @GetMapping("/{id}")
 public ResponseEntity<JobResponce> getJob(
         @PathVariable Long id) {

     return ResponseEntity.ok(
             jobService.getJobById(id)
     );
 }
}