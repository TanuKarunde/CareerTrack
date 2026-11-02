
package com.careertrack.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careertrack.service.FeatureUsageService;

@RestController
@RequestMapping("/api/feature-usage")
public class FeatureUsageController {

    private final FeatureUsageService featureUsageService;

    public FeatureUsageController(
            FeatureUsageService featureUsageService) {
        this.featureUsageService = featureUsageService;
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Object>> getStatus(
            Authentication authentication) {

        return ResponseEntity.ok(
                featureUsageService.getUsageStatus(
                        authentication.getName()));
    }
}
