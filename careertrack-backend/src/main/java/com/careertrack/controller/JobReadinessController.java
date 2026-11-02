package com.careertrack.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.careertrack.dto.JobReadinessResponse;
import com.careertrack.entity.User;
import com.careertrack.service.JobReadinessService;

@RestController
@RequestMapping("/api/readiness")
public class JobReadinessController {

    private final JobReadinessService readinessService;

    public JobReadinessController(
            JobReadinessService readinessService) {
        this.readinessService = readinessService;
    }

    @PostMapping("/jobs/{jobId}/calculate")
    public JobReadinessResponse calculateReadiness(
            @PathVariable Long jobId,
            @AuthenticationPrincipal User user) {

        validateStudent(user);

        return readinessService.calculateReadiness(jobId, user);
    }

    @GetMapping("/jobs/{jobId}")
    public JobReadinessResponse getReadiness(
            @PathVariable Long jobId,
            @AuthenticationPrincipal User user) {

        validateStudent(user);

        return readinessService.getReadiness(jobId, user);
    }

    @GetMapping("/history")
    public List<JobReadinessResponse> getHistory(
            @AuthenticationPrincipal User user) {

        validateStudent(user);

        return readinessService.getHistory(user);
    }

    private void validateStudent(User user) {

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in first"
            );
        }

        if (user.getRole() == null
                || !"STUDENT".equals(user.getRole().name())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only students can access readiness reports"
            );
        }
    }
}
