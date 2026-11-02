
package com.careertrack.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.careertrack.service.AdminJobService;

@RestController
@RequestMapping("/api/admin/jobs")
@PreAuthorize("hasRole('ADMIN')")
public class AdminJobController {

    private final AdminJobService adminJobService;

    public AdminJobController(AdminJobService adminJobService) {
        this.adminJobService = adminJobService;
    }

    @GetMapping
    public ResponseEntity<?> getJobs(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "ALL") String jobType) {

        try {
            return ResponseEntity.ok(
                    adminJobService.getJobs(search, status, jobType)
            );
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJob(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminJobService.getJob(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateJobStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {

        try {
            return ResponseEntity.ok(
                    adminJobService.updateJobStatus(id, active)
            );
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", ex.getMessage()));
        }
    }
}
