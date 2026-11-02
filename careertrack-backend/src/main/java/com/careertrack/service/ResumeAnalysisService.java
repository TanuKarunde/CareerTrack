
package com.careertrack.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.careertrack.dto.ResumeAnalysisResponse;
import com.careertrack.entity.Job;
import com.careertrack.entity.ResumeAnalysis;
import com.careertrack.entity.StudentProfile;
import com.careertrack.repository.JobRepository;
import com.careertrack.repository.ResumeAnalysisRepository;
import com.careertrack.repository.StudentProfileRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ResumeAnalysisService {

    private final StudentProfileRepository profileRepository;
    private final JobRepository jobRepository;
    private final ResumeAnalysisRepository analysisRepository;
    private final ResumeParserService parserService;
    private final ResumeScoringService scoringService;
    private final JobMatchService jobMatchService;
    private final AIResumeFeedbackService aiService;
    private final ObjectMapper objectMapper;
    private final FeatureUsageService featureUsageService;

    public ResumeAnalysisService(
            StudentProfileRepository profileRepository,
            JobRepository jobRepository,
            ResumeAnalysisRepository analysisRepository,
            ResumeParserService parserService,
            ResumeScoringService scoringService,
            JobMatchService jobMatchService,
            AIResumeFeedbackService aiService,
            ObjectMapper objectMapper,
            FeatureUsageService featureUsageService) {

        this.profileRepository = profileRepository;
        this.jobRepository = jobRepository;
        this.analysisRepository = analysisRepository;
        this.parserService = parserService;
        this.scoringService = scoringService;
        this.jobMatchService = jobMatchService;
        this.aiService = aiService;
        this.objectMapper = objectMapper;
        this.featureUsageService = featureUsageService;
    }

    @Transactional
    public ResumeAnalysisResponse analyze(
            String email, MultipartFile file, Long jobId) {

        // 1. Find the logged-in student's profile.
        StudentProfile profile = profileRepository
                .findByUser_Email(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student profile not found"));

        byte[] resumeBytes;
        String resumeName;
        String resumeType;
        String source;

        // 2. Prefer a newly uploaded resume.
        // Otherwise, use the resume saved in the student profile.
        try {
            if (file != null && !file.isEmpty()) {

                resumeBytes = file.getBytes();
                resumeName = file.getOriginalFilename();
                resumeType = file.getContentType();
                source = "UPLOAD";

            } else {

                resumeBytes = profile.getResume();
                resumeName = profile.getResumeName();
                resumeType = profile.getResumeType();
                source = "PROFILE";
            }

        } catch (IOException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Could not read the uploaded resume");
        }

        // 3. Make sure a resume exists.
        if (resumeBytes == null || resumeBytes.length == 0) {
        	
        	
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please upload a resume or save one in your student profile");
        }
        
     // Enforce the free Resume Analyzer allowance.
     // Active Premium students have unlimited analyses.
     featureUsageService.consumeResumeUse(email);

        // 4. Extract text from the PDF or DOCX resume.
        String resumeText = parserService.extractText(
                resumeBytes,
                resumeName,
                resumeType);

        // 5. Calculate general resume scores.
        Map<String, Object> scores =
                scoringService.analyze(resumeText);

        Job job = null;
        Map<String, Object> match = null;
        String jobDescription = null;

        // 6. If a job ID is supplied, calculate job-specific matching.
        if (jobId != null) {

            job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Job not found"));

            jobDescription = safe(job.getDescription());

            match = jobMatchService.match(resumeText, job);

            scores.put("jobTitle", job.getTitle());
            scores.put("jobMatchScore", match.get("jobMatchScore"));
            scores.put("matchedSkills", match.get("matchedSkills"));
            scores.put("missingSkills", match.get("missingSkills"));
        }

        // 7. Generate additional feedback using Gemini.
        String aiFeedback = aiService.generateFeedback(
                resumeText,
                scores,
                jobDescription);
        
     // Recommend jobs automatically from all active jobs.
        List<Map<String, Object>> recommendedJobs =
                jobMatchService.matchAll(
                        resumeText,
                        profile,
                        jobRepository.findByActiveTrue()
                );
        
        scores.put("recommendedJobs", recommendedJobs);

        scores.put("aiFeedback", aiFeedback);
        scores.put("source", source);
        scores.put("resumeName", resumeName);

        // 8. Save the analysis in the database.
        ResumeAnalysis saved = new ResumeAnalysis();

        saved.setStudentProfile(profile);
        saved.setJobId(job == null ? null : job.getId());
        saved.setJobTitle(job == null ? null : job.getTitle());
        saved.setResumeName(resumeName);
        saved.setSource(source);

        saved.setOverallScore(number(scores, "overallScore"));
        saved.setAtsScore(number(scores, "atsScore"));
        saved.setSkillsScore(number(scores, "skillsScore"));
        saved.setProjectsScore(number(scores, "projectsScore"));
        saved.setEducationScore(number(scores, "educationScore"));
        saved.setExperienceScore(number(scores, "experienceScore"));

        if (match != null) {
            int matchScore = number(match, "jobMatchScore");

            saved.setJobMatchScore(
                    matchScore < 0 ? null : matchScore);
        }

        try {
            saved.setReportJson(
                    objectMapper.writeValueAsString(scores));

        } catch (IOException ex) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not save analysis report");
        }

        saved = analysisRepository.save(saved);

        return toResponse(saved, scores);
    }

    // 9. Get the logged-in student's analysis history.
    @Transactional(readOnly = true)
    public List<ResumeAnalysisResponse> history(String email) {

        StudentProfile profile = profileRepository
                .findByUser_Email(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student profile not found"));

        return analysisRepository
                .findByStudentProfile_IdOrderByAnalyzedAtDesc(
                        profile.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }
    
    @Transactional
    public void deleteReport(String email, Long analysisId) {
        StudentProfile profile = profileRepository
                .findByUser_Email(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student profile not found"));

        ResumeAnalysis analysis = analysisRepository
                .findByIdAndStudentProfile_Id(
                        analysisId, profile.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Resume analysis not found"));

        analysisRepository.delete(analysis);
    }

    @Transactional
    public void deleteHistory(String email) {
        StudentProfile profile = profileRepository
                .findByUser_Email(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student profile not found"));

        List<ResumeAnalysis> analyses = analysisRepository
                .findByStudentProfile_IdOrderByAnalyzedAtDesc(
                        profile.getId());

        analysisRepository.deleteAll(analyses);
    }

    // 10. Get a single report belonging to the logged-in student.
    @Transactional(readOnly = true)
    public ResumeAnalysisResponse getReport(
            String email, Long analysisId) {

        StudentProfile profile = profileRepository
                .findByUser_Email(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student profile not found"));

        ResumeAnalysis analysis = analysisRepository
                .findByIdAndStudentProfile_Id(
                        analysisId, profile.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Resume analysis not found"));

        return toResponse(analysis);
    }

    private ResumeAnalysisResponse toResponse(
            ResumeAnalysis analysis) {

        try {
            Map<String, Object> report = objectMapper.readValue(
                    analysis.getReportJson(),
                    new TypeReference<Map<String, Object>>() {});

            return toResponse(analysis, report);

        } catch (Exception ex) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not read analysis report");
        }
    }

    @SuppressWarnings("unchecked")
    private ResumeAnalysisResponse toResponse(
            ResumeAnalysis analysis,
            Map<String, Object> data) {

        ResumeAnalysisResponse response =
                new ResumeAnalysisResponse();

        response.setId(analysis.getId());
        response.setResumeName(analysis.getResumeName());
        response.setSource(analysis.getSource());
        response.setAnalyzedAt(analysis.getAnalyzedAt());

        response.setOverallScore(analysis.getOverallScore());
        response.setAtsScore(analysis.getAtsScore());
        response.setSkillsScore(analysis.getSkillsScore());
        response.setProjectsScore(analysis.getProjectsScore());
        response.setEducationScore(analysis.getEducationScore());
        response.setExperienceScore(analysis.getExperienceScore());

        response.setJobTitle(analysis.getJobTitle());
        response.setJobMatchScore(analysis.getJobMatchScore());

        response.setMatchedSkills(
                (List<String>) data.getOrDefault(
                        "matchedSkills", List.of()));

        response.setMissingSkills(
                (List<String>) data.getOrDefault(
                        "missingSkills", List.of()));

        response.setStrengths(
                (List<String>) data.getOrDefault(
                        "strengths", List.of()));

        response.setImprovements(
                (List<String>) data.getOrDefault(
                        "improvements", List.of()));

        Object details = data.get("extractedDetails");

        if (details instanceof Map<?, ?> map) {
            response.setExtractedDetails(
                    (Map<String, Object>) map);
        }

        response.setAiFeedback(
                (String) data.get("aiFeedback"));

        // Add recommended jobs to the response
        Object jobsData = data.get("recommendedJobs");

        if (jobsData instanceof List<?> jobsList) {
            response.setRecommendedJobs(
                    (List<Map<String, Object>>) jobsList
            );
        }

        return response;
    }

    private int number(Map<String, Object> data, String key) {
        Object value = data.get(key);
        return value instanceof Number n ? n.intValue() : 0;
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}

