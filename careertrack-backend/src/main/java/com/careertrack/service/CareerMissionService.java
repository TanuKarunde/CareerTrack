package com.careertrack.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.careertrack.dto.CareerMissionAiResponse;
import com.careertrack.dto.CareerMissionAiResponse.MissionItem;
import com.careertrack.dto.MissionAssessmentResult;
import com.careertrack.dto.MissionAssessmentStartResponse;
import com.careertrack.dto.MissionAssessmentStartResponse.Question;
import com.careertrack.dto.MissionAssessmentSubmission;
import com.careertrack.entity.CareerMission;
import com.careertrack.entity.Job;
import com.careertrack.entity.JobReadinessReport;
import com.careertrack.entity.MissionStatus;
import com.careertrack.entity.StudentProfile;
import com.careertrack.entity.StudentProject;
import com.careertrack.entity.User;
import com.careertrack.repository.CareerMissionRepository;
import com.careertrack.repository.JobReadinessReportRepository;
import com.careertrack.repository.JobRepository;
import com.careertrack.repository.StudentProfileRepository;
import com.careertrack.repository.StudentProjectRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class CareerMissionService {

    private final CareerMissionRepository missionRepository;
    private final JobReadinessReportRepository reportRepository;
    private final JobRepository jobRepository;
    private final StudentProfileRepository profileRepository;
    private final StudentProjectRepository projectRepository;
    private final OpenAIInterviewService aiService;
    private final ObjectMapper objectMapper;

    public CareerMissionService(
            CareerMissionRepository missionRepository,
            JobReadinessReportRepository reportRepository,
            JobRepository jobRepository,
            StudentProfileRepository profileRepository,
            StudentProjectRepository projectRepository,
            OpenAIInterviewService aiService,
            ObjectMapper objectMapper) {

        this.missionRepository = missionRepository;
        this.reportRepository = reportRepository;
        this.jobRepository = jobRepository;
        this.profileRepository = profileRepository;
        this.projectRepository = projectRepository;
        this.aiService = aiService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public List<CareerMission> generateMissions(
            Long jobId,
            User user) {

        if (user == null || user.getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in first"
            );
        }

        Long studentId = user.getId();

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Job not found"
                ));

        StudentProfile profile = profileRepository
                .findByUserId(studentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Please complete your student profile first"
                ));

        JobReadinessReport report = reportRepository
                .findTopByStudentIdAndJobIdOrderByCreatedAtDesc(
                        studentId,
                        jobId
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Calculate job readiness before generating missions"
                ));

        // Reuse saved missions for this exact readiness report.
        if (missionRepository
                .existsByStudentIdAndJobIdAndReadinessReportId(
                        studentId,
                        jobId,
                        report.getId())) {

            return missionRepository
                    .findByStudentIdAndJobIdOrderByCreatedAtDesc(
                            studentId,
                            jobId
                    )
                    .stream()
                    .filter(m -> report.getId()
                            .equals(m.getReadinessReportId()))
                    .toList();
        }

        List<String> matchedSkills =
                parseJsonList(report.getMatchedSkills());

        List<String> missingSkills =
                parseJsonList(report.getMissingSkills());

        List<StudentProject> projects =
                projectRepository.findByStudentProfileId(
                        profile.getId()
                );

        String studentContext = buildStudentContext(
                job,
                report,
                profile,
                projects,
                matchedSkills,
                missingSkills
        );

        CareerMissionAiResponse aiResponse =
                aiService.generateCareerMissions(studentContext);

        List<MissionItem> items = aiResponse.getMissions();

        if (items == null || items.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "AI did not generate any missions"
            );
        }

        // Validate everything before saving any missions.
        List<CareerMission> missions = new ArrayList<>();

        for (MissionItem item : items) {
            validateMission(item, missingSkills, job.getSkills());

            CareerMission mission = new CareerMission();

            mission.setStudentId(studentId);
            mission.setJobId(jobId);
            mission.setReadinessReportId(report.getId());
            mission.setTitle(item.getTitle().trim());
            mission.setDescription(item.getDescription().trim());
            mission.setMissionType(
                    item.getMissionType()
                            .trim()
                            .toUpperCase(Locale.ROOT)
            );
            mission.setTargetSkill(item.getTargetSkill().trim());
            mission.setEstimatedMinutes(item.getEstimatedMinutes());
            mission.setXpReward(item.getXpReward());

            missions.add(mission);
        }

        return missionRepository.saveAll(missions);
    }

    private String buildStudentContext(
            Job job,
            JobReadinessReport report,
            StudentProfile profile,
            List<StudentProject> projects,
            List<String> matchedSkills,
            List<String> missingSkills) {

        String projectDetails = projects.stream()
                .map(project ->
                        "Project: " + safe(project.getProjectName())
                        + "\nDescription: "
                        + safe(project.getDescription())
                        + "\nTechnologies: "
                        + safe(project.getTechnologies()))
                .collect(Collectors.joining("\n\n"));

        if (projectDetails.isBlank()) {
            projectDetails = "No student projects are currently recorded.";
        }

        return """
                Target job: %s
                Job-required skills: %s
                Current readiness score: %d/100
                Matched skills: %s
                Missing skills: %s
                Student profile skills: %s
                Project score: %d/20
                Profile score: %d/10
                Criteria score: %d/10

                Student projects:
                %s

                Readiness recommendations:
                %s
                """.formatted(
                safe(job.getTitle()),
                safe(job.getSkills()),
                report.getReadinessScore(),
                matchedSkills,
                missingSkills,
                safe(profile.getSkills()),
                report.getProjectScore(),
                report.getProfileScore(),
                report.getCriteriaScore(),
                projectDetails,
                extractSuggestions(report.getReportJson())
        );
    }

    private void validateMission(
            MissionItem item,
            List<String> missingSkills,
            String jobSkills) {

        if (item == null
                || isBlank(item.getTitle())
                || isBlank(item.getDescription())
                || isBlank(item.getMissionType())
                || isBlank(item.getTargetSkill())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "AI returned a mission with missing required fields"
            );
        }

        if (item.getTitle().trim().length() > 180
                || item.getTargetSkill().trim().length() > 100) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "AI returned a mission with fields that are too long"
            );
        }

        Set<String> allowedTypes = Set.of(
                "SKILL", "CODING", "PROJECT", "INTERVIEW", "PROFILE"
        );

        String type = item.getMissionType()
                .trim()
                .toUpperCase(Locale.ROOT);

        if (!allowedTypes.contains(type)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "AI returned an unsupported mission type"
            );
        }

        if (item.getEstimatedMinutes() == null
                || item.getEstimatedMinutes() < 10
                || item.getEstimatedMinutes() > 180) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "AI returned an invalid mission duration"
            );
        }

        if (item.getXpReward() == null
                || item.getXpReward() < 10
                || item.getXpReward() > 100) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "AI returned an invalid XP reward"
            );
        }

        // Do not accept a target skill unrelated to the job.
        Set<String> relevantSkills = Arrays.stream(
                        safe(jobSkills).split("[,;\\n]")
                )
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(s -> s.toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());

        missingSkills.stream()
                .map(s -> s.toLowerCase(Locale.ROOT))
                .forEach(relevantSkills::add);

        String target = item.getTargetSkill()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (!relevantSkills.contains(target)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "AI returned a target skill unrelated to the job"
            );
        }
    }

    private List<String> parseJsonList(String json) {
        if (json == null || json.isBlank()) {
            return new ArrayList<>();
        }

        try {
            return objectMapper.readValue(
                    json,
                    new TypeReference<List<String>>() {}
            );
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to read saved readiness skills"
            );
        }
    }

    private String extractSuggestions(String reportJson) {
        if (reportJson == null || reportJson.isBlank()) {
            return "No additional recommendations recorded.";
        }

        try {
            var root = objectMapper.readTree(reportJson);
            var suggestions = root.get("suggestions");

            return suggestions == null
                    ? "No additional recommendations recorded."
                    : suggestions.toString();

        } catch (Exception e) {
            return "Review the student's missing skills and project gaps.";
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
    
    @Transactional(readOnly = true)
    public List<CareerMission> getMissions(
            Long jobId,
            User user) {

        if (user == null || user.getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in first"
            );
        }

        return missionRepository
                .findByStudentIdAndJobIdOrderByCreatedAtDesc(
                        user.getId(),
                        jobId
                );
    }

    @Transactional
    public CareerMission completeMission(
            Long missionId,
            User user) {

        if (user == null || user.getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in first"
            );
        }

        CareerMission mission = missionRepository
                .findById(missionId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Mission not found"
                ));

        if (!mission.getStudentId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot complete another student's mission"
            );
        }

        if (mission.getStatus() == MissionStatus.COMPLETED) {
            return mission;
        }

        mission.setStatus(MissionStatus.COMPLETED);
        mission.setCompletedAt(LocalDateTime.now());

        return missionRepository.save(mission);
    }
    


private String createAssessmentJson(
        int questionCount,
        CareerMission mission) {

    try {
        var generatedQuestions =
                aiService.generateAssessmentQuestions(
                        questionCount,
                        safe(mission.getTargetSkill()),
                        safe(mission.getTitle()),
                        safe(mission.getDescription())
                );

        if (generatedQuestions.size() != questionCount) {
            throw new IllegalStateException(
                    "AI did not generate the requested number of questions"
            );
        }

        List<Map<String, Object>> questions = new ArrayList<>();

        int id = 1;

        for (var question : generatedQuestions) {
            Map<String, Object> item = new HashMap<>();

            item.put("id", id++);
            item.put("topic", question.topic());
            item.put("question", question.question());
            item.put("options", question.options());
            item.put("correctAnswer", question.correctAnswer());
            item.put("marks", 1);

            questions.add(item);
        }

        return objectMapper.writeValueAsString(questions);

    } catch (Exception e) {
        throw new IllegalStateException(
                "Could not generate AI assessment questions",
                e
        );
    }
}




@Transactional
public MissionAssessmentStartResponse startAssessment(
        Long missionId,
        int questionCount,
        User user) {

    validateStudent(user);

    if (questionCount != 50 && questionCount != 100) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Choose 50 or 100 questions"
        );
    }

    CareerMission mission = missionRepository.findById(missionId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Mission not found"
            ));

    if (!mission.getStudentId().equals(user.getId())) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "This mission does not belong to you"
        );
    }

    if (mission.getStatus() == MissionStatus.COMPLETED) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Mission is already completed"
        );
    }

    String type = mission.getMissionType() == null
            ? ""
            : mission.getMissionType().trim();

    if (!type.equalsIgnoreCase("INTERVIEW")
            && !type.equalsIgnoreCase("CODING")
            && !type.equalsIgnoreCase("SKILL")) {

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "This mission requires an assignment workflow, not a quiz"
        );
    }

    boolean resumeExistingAttempt =
            mission.getStatus() == MissionStatus.IN_PROGRESS
            && mission.getStartedAt() != null
            && mission.getSubmittedAt() == null
            && mission.getAssessmentJson() != null
            && !mission.getAssessmentJson().isBlank();


if (resumeExistingAttempt) {
    try {
        long elapsed = Duration.between(
                mission.getStartedAt(),
                LocalDateTime.now()
        ).getSeconds();

        int currentQuestionCount = objectMapper
                .readTree(mission.getAssessmentJson()).size();

        int durationSeconds = currentQuestionCount * 60;

        // Resume only if the existing attempt is still valid.
        if (elapsed <= durationSeconds + 30) {

            if (currentQuestionCount != questionCount) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "An assessment with a different question count is already in progress."
                );
            }

            return buildAssessmentResponse(
                    mission,
                    durationSeconds
            );
        }

        // If expired, continue below and create a fresh attempt.

    } catch (ResponseStatusException e) {
        throw e;
    } catch (Exception e) {
        throw new IllegalStateException(
                "Could not resume assessment",
                e
        );
    }
}

// Start a new attempt or retry an expired/failed assessment.
mission.setAssessmentJson(
        createAssessmentJson(questionCount, mission)
);
mission.setStatus(MissionStatus.IN_PROGRESS);
mission.setStartedAt(LocalDateTime.now());
mission.setSubmittedAt(null);
mission.setScore(null);
mission.setTotalMarks(null);
mission.setTimeTakenSeconds(null);
mission.setCompletedAt(null);
mission.setXpAwarded(0);

missionRepository.save(mission);

return buildAssessmentResponse(
        mission,
        questionCount * 60
);

}




@Transactional
public MissionAssessmentResult submitAssessment(
        Long missionId,
        MissionAssessmentSubmission submission,
        User user) {

    validateStudent(user);

    CareerMission mission = missionRepository.findById(missionId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Mission not found"));

    if (!mission.getStudentId().equals(user.getId())) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "This mission does not belong to you");
    }

    if (mission.getStatus() == MissionStatus.COMPLETED) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Mission is already completed");
    }

    if (mission.getStartedAt() == null
            || mission.getStatus() != MissionStatus.IN_PROGRESS) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Start the mission before submitting");
    }

    if (submission == null || submission.answers() == null) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Please submit your answers");
    }

    LocalDateTime submittedAt = LocalDateTime.now();

    long timeTaken = Math.max(
            0,
            Duration.between(
                    mission.getStartedAt(),
                    submittedAt
            ).getSeconds()
    );

    try {
        JsonNode questions = objectMapper.readTree(
                mission.getAssessmentJson());

        int durationSeconds = questions.size() * 60;

        if (timeTaken > durationSeconds + 30) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Assessment time has expired. Start a new attempt.");
        }

        Map<Integer, String> submittedAnswers = new HashMap<>();

        for (MissionAssessmentSubmission.Answer answer
                : submission.answers()) {

            if (answer == null
                    || answer.questionId() == null
                    || answer.selectedOption() == null) {
                continue;
            }

            submittedAnswers.put(
                    answer.questionId(),
                    answer.selectedOption()
                            .trim()
                            .toUpperCase(Locale.ROOT)
            );
        }

        int score = 0;
        int totalMarks = 0;
        int attemptedCount = 0;
        int correctCount = 0;

        for (JsonNode question : questions) {

            int questionId = question.path("id").asInt();
            int marks = question.path("marks").asInt(1);

            totalMarks += marks;

            String selected = submittedAnswers.get(questionId);
            String correct = question.path("correctAnswer").asText();

            if (selected == null || selected.isBlank()) {
                continue;
            }

            JsonNode options = question.path("options");
            boolean validOption = false;

            for (JsonNode option : options) {

                String optionText = option.asText("").trim();

                if (optionText.isEmpty()) {
                    continue;
                }

                String key = optionText.substring(0, 1)
                        .toUpperCase(Locale.ROOT);

                if (Set.of("A", "B", "C", "D").contains(key)
                        && key.equals(selected)) {
                    validOption = true;
                    break;
                }
            }

            if (validOption) {
                attemptedCount++;

                if (correct.equalsIgnoreCase(selected)) {
                    correctCount++;
                    score += marks;
                }
            }
        }

        int skippedCount = questions.size() - attemptedCount;
        int wrongCount = attemptedCount - correctCount;

        double percentage = totalMarks == 0
                ? 0.0
                : score * 100.0 / totalMarks;

        percentage = Math.round(percentage * 100.0) / 100.0;

        boolean passed = percentage >= 70.0;

        mission.setScore(score);
        mission.setTotalMarks(totalMarks);
        mission.setTimeTakenSeconds(timeTaken);
        mission.setSubmittedAt(submittedAt);

        int xpAwarded = 0;

        if (passed) {
            mission.setStatus(MissionStatus.COMPLETED);
            mission.setCompletedAt(submittedAt);

            xpAwarded = mission.getXpReward() == null
                    ? 0
                    : mission.getXpReward();

            mission.setXpAwarded(xpAwarded);

        } else {
            mission.setStatus(MissionStatus.IN_PROGRESS);
            mission.setXpAwarded(0);
        }

        missionRepository.save(mission);

        return new MissionAssessmentResult(
                mission.getId(),
                score,
                totalMarks,
                percentage,
                timeTaken,
                passed,
                mission.getStatus().toString(),
                xpAwarded,
                passed
                        ? "Assessment passed! Mission completed."
                        : "Not passed yet. Review the topics and try again.",
                attemptedCount,
                skippedCount,
                correctCount,
                wrongCount
        );

    } catch (ResponseStatusException e) {
        throw e;
    } catch (Exception e) {
        throw new IllegalStateException(
                "Could not grade assessment", e);
    }
}


private void validateStudent(User user) {

    if (user == null) {
        throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "User is not authenticated"
        );
    }

    if (user.getRole() == null
            || !user.getRole().toString().equalsIgnoreCase("STUDENT")) {

        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Only students can perform this action"
        );
    }
}

private MissionAssessmentStartResponse buildAssessmentResponse(
        CareerMission mission,
        int durationSeconds) {

    try {
        JsonNode root = objectMapper.readTree(
                mission.getAssessmentJson()
        );

        List<Question> visibleQuestions = new ArrayList<>();

        for (JsonNode item : root) {
            List<String> options = new ArrayList<>();

            for (JsonNode option : item.get("options")) {
                options.add(option.asText());
            }

            visibleQuestions.add(new Question(
                    item.get("id").asInt(),
                    item.path("topic").asText("General"),
                    item.get("question").asText(),
                    options,
                    item.path("marks").asInt(1)
            ));
        }

        return new MissionAssessmentStartResponse(
                mission.getId(),
                mission.getTitle(),
                mission.getDescription(),
                mission.getStartedAt(),
                durationSeconds,
                visibleQuestions.size(),
                visibleQuestions
        );

    } catch (Exception e) {
        throw new IllegalStateException(
                "Could not load assessment questions", e
        );
    }
}
}
