
package com.careertrack.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.careertrack.dto.ResumeAnalysisResponse;
import com.careertrack.service.ResumeAnalysisService;

@RestController
@RequestMapping("/api/resume-analyzer")
public class ResumeAnalysisController {

    private final ResumeAnalysisService analysisService;

    public ResumeAnalysisController(
            ResumeAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    // Analyze an uploaded resume or the resume saved in the profile.
    // Job recommendations are generated automatically by the service.
    @PostMapping(
            value = "/analyze",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResumeAnalysisResponse analyze(
            Authentication authentication,
            @RequestParam(value = "file", required = false)
            MultipartFile file) {

        return analysisService.analyze(
                authentication.getName(),
                file,
                null);
    }

    // Get the logged-in student's analysis history.
    @GetMapping("/history")
    public List<ResumeAnalysisResponse> getHistory(
            Authentication authentication) {

        return analysisService.history(
                authentication.getName());
    }

    // Get one saved analysis report.
    @GetMapping("/{analysisId}")
    public ResumeAnalysisResponse getReport(
            Authentication authentication,
            @PathVariable Long analysisId) {

        return analysisService.getReport(
                authentication.getName(),
                analysisId);
    }
    
 // Delete one report
    @DeleteMapping("/{analysisId}")
    public void deleteReport(
            Authentication authentication,
            @PathVariable Long analysisId) {

        analysisService.deleteReport(
                authentication.getName(), analysisId);
    }


    // Delete all reports for the logged-in student
    @DeleteMapping("/history")
    public void deleteHistory(Authentication authentication) {
        analysisService.deleteHistory(authentication.getName());
    }
}
