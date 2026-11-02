package com.careertrack.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.careertrack.dto.AnswerEvaluationResponse;
import com.careertrack.dto.InterviewQuestionResponse;
import com.careertrack.dto.InterviewResultResponse;
import com.careertrack.dto.InterviewSkillResponse;
import com.careertrack.dto.InterviewStartRequest;
import com.careertrack.dto.InterviewStartResponse;
import com.careertrack.dto.InterviewTopicResponse;
import com.careertrack.dto.ScoreboardResponse;
import com.careertrack.dto.SubmitAnswerRequest;
import com.careertrack.dto.SubmitInterviewRequest;
import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;
import com.careertrack.service.InterviewPreparationService;
import com.careertrack.service.InterviewScoreboardService;
import com.careertrack.service.InterviewScoringService;

@RestController
@RequestMapping("/api/interview-preparation")
@CrossOrigin(origins = "http://localhost:5173")
public class InterviewPreparationController {

    private final InterviewPreparationService interviewPreparationService;

    private final UserRepository userRepository;
    
    private final InterviewScoringService interviewScoringService;
    
    private final InterviewScoreboardService
    interviewScoreboardService;

    public InterviewPreparationController(
            InterviewPreparationService interviewPreparationService,
            UserRepository userRepository,
            InterviewScoringService interviewScoringService,
            InterviewScoreboardService interviewScoreboardService) {

        this.interviewPreparationService =
                interviewPreparationService;

        this.userRepository =
                userRepository;

        this.interviewScoringService =
                interviewScoringService;

        this.interviewScoreboardService =
                interviewScoreboardService;
    }

    /*
     * GET ALL ACTIVE TOPICS
     *
     * GET
     * /api/interview-preparation/topics
     */
    @GetMapping("/topics")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<InterviewTopicResponse>>
            getTopics() {

        return ResponseEntity.ok(
                interviewPreparationService
                        .getActiveTopics()
        );
    }

    /*
     * START INTERVIEW PREPARATION
     *
     * POST
     * /api/interview-preparation/start
     */
    @PostMapping("/start")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<InterviewStartResponse>
            startInterview(
                    @RequestBody InterviewStartRequest request,
                    Authentication authentication) {

        String email = authentication.getName();

        User student = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"));

        InterviewStartResponse response =
                interviewPreparationService.startSession(
                        request,
                        student
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    
    @GetMapping("/{sessionId}/questions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<InterviewQuestionResponse>> getQuestions(
            @PathVariable Long sessionId,
            Authentication authentication) {

        String email = authentication.getName();

        User student =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        return ResponseEntity.ok(
                interviewPreparationService
                        .getQuestions(sessionId, student)
        );
    }
    
    @PostMapping("/{sessionId}/answer")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AnswerEvaluationResponse> submitAnswer(
            @PathVariable Long sessionId,
            @RequestBody SubmitAnswerRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User student =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        AnswerEvaluationResponse response =
                interviewScoringService.submitAnswer(
                        sessionId,
                        request.getQuestionId(),
                        request.getAnswer(),
                        student.getId()
                );

        return ResponseEntity.ok(response);
    }
    

@PostMapping("/{sessionId}/complete")
@PreAuthorize("hasRole('STUDENT')")
public ResponseEntity<InterviewResultResponse> completeInterview(
        @PathVariable Long sessionId,
        @RequestBody Map<Long, String> submittedAnswers,
        Authentication authentication) {

    String email = authentication.getName();

    User student = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Student not found")
            );

    InterviewResultResponse result =
            interviewScoringService.completeInterview(
                    sessionId,
                    student.getId(),
                    submittedAnswers
            );

    return ResponseEntity.ok(result);
}

    
    @GetMapping("/{sessionId}/result")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<InterviewResultResponse> getResult(
            @PathVariable Long sessionId,
            Authentication authentication) {

        String email = authentication.getName();

        User student =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        InterviewResultResponse result =
                interviewScoringService.getResult(
                        sessionId,
                        student.getId()
                );

        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/scoreboard")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ScoreboardResponse> getScoreboard(
            Authentication authentication) {

        String email = authentication.getName();

        User student =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        ScoreboardResponse scoreboard =
                interviewScoreboardService
                        .getScoreboard(student);

        return ResponseEntity.ok(scoreboard);
    }
    
    @GetMapping("/topics/{topicId}/skills")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<InterviewSkillResponse>> getSkills(
            @PathVariable Long topicId) {

        return ResponseEntity.ok(
            interviewPreparationService.getSkills(topicId)
        );
    }
}