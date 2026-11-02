
package com.careertrack.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.careertrack.dto.MissionAssessmentResult;
import com.careertrack.dto.MissionAssessmentStartResponse;
import com.careertrack.dto.MissionAssessmentSubmission;
import com.careertrack.entity.CareerMission;
import com.careertrack.entity.User;
import com.careertrack.service.CareerMissionService;

@RestController
@RequestMapping("/api/mission-control")
public class CareerMissionController {

    private final CareerMissionService missionService;

    public CareerMissionController(
            CareerMissionService missionService) {
        this.missionService = missionService;
    }

    @PostMapping("/jobs/{jobId}/generate")
    public List<CareerMission> generateMissions(
            @PathVariable Long jobId,
            @AuthenticationPrincipal User user) {

        validateStudent(user);

        return missionService.generateMissions(jobId, user);
    }

    @GetMapping("/jobs/{jobId}")
    public List<CareerMission> getMissions(
            @PathVariable Long jobId,
            @AuthenticationPrincipal User user) {

        validateStudent(user);

        return missionService.getMissions(jobId, user);
    }

    @PatchMapping("/missions/{missionId}/complete")
    public CareerMission completeMission(
            @PathVariable Long missionId,
            @AuthenticationPrincipal User user) {

        validateStudent(user);

        return missionService.completeMission(
                missionId,
                user
        );
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
                    "Only students can access Mission Control"
            );
        }
    }
    

    @PostMapping("/missions/{missionId}/start")
    public MissionAssessmentStartResponse startAssessment(
            @PathVariable Long missionId,
            @RequestParam(defaultValue = "50") int questionCount,
            @AuthenticationPrincipal User user) {

        validateStudent(user);

        if (questionCount != 50 && questionCount != 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Choose either 50 or 100 questions"
            );
        }

        long startTime = System.currentTimeMillis();

        MissionAssessmentStartResponse response =
                missionService.startAssessment(
                        missionId, questionCount, user
                );

        System.out.println(
                "Assessment start took: "
                + (System.currentTimeMillis() - startTime)
                + " ms"
        );

        return response;
    }

@PostMapping("/missions/{missionId}/submit")
public MissionAssessmentResult submitAssessment(
        @PathVariable Long missionId,
        @RequestBody MissionAssessmentSubmission submission,
        @AuthenticationPrincipal User user) {

    validateStudent(user);

    return missionService.submitAssessment(
            missionId, submission, user
    );

}

}
