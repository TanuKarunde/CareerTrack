
package com.careertrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careertrack.dto.SmartMatchResponse;
import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;
import com.careertrack.service.SmartCandidateMatchService;

@RestController
@RequestMapping("/api/employer/jobs")
public class SmartCandidateMatchController {

    private final SmartCandidateMatchService matchService;
    private final UserRepository userRepository;

    public SmartCandidateMatchController(
            SmartCandidateMatchService matchService,
            UserRepository userRepository) {
        this.matchService = matchService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{jobId}/smart-matches")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<SmartMatchResponse>> getSmartMatches(
            @PathVariable Long jobId,
            Authentication authentication) {

        User employer = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("Employer not found"));

        return ResponseEntity.ok(
                matchService.getRankedCandidates(jobId, employer));
    }
}
