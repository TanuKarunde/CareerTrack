package com.careertrack.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careertrack.dto.InterviewQuestionResponse;
import com.careertrack.dto.InterviewSkillResponse;
import com.careertrack.dto.InterviewStartRequest;
import com.careertrack.dto.InterviewStartResponse;
import com.careertrack.dto.InterviewTopicResponse;

import com.careertrack.entity.InterviewQuestion;
import com.careertrack.entity.InterviewSession;
import com.careertrack.entity.InterviewSkill;
import com.careertrack.entity.InterviewTopic;
import com.careertrack.entity.User;

import com.careertrack.repository.InterviewAnswerRepository;
import com.careertrack.repository.InterviewQuestionRepository;
import com.careertrack.repository.InterviewSessionRepository;
import com.careertrack.repository.InterviewSkillRepository;
import com.careertrack.repository.InterviewTopicRepository;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Service
public class InterviewPreparationService {

    private final InterviewTopicRepository interviewTopicRepository;

    private final InterviewSessionRepository interviewSessionRepository;

    private final InterviewQuestionRepository interviewQuestionRepository;

    private final InterviewSkillRepository interviewSkillRepository;

    private final InterviewAnswerRepository interviewAnswerRepository;

    private final OpenAIInterviewService openAIInterviewService;

    private final ObjectMapper objectMapper;
    
    private final FeatureUsageService featureUsageService;


    public InterviewPreparationService(

            InterviewTopicRepository interviewTopicRepository,

            InterviewSessionRepository interviewSessionRepository,

            InterviewQuestionRepository interviewQuestionRepository,

            InterviewAnswerRepository interviewAnswerRepository,

            InterviewSkillRepository interviewSkillRepository,

            OpenAIInterviewService openAIInterviewService,

            ObjectMapper objectMapper,
            
            FeatureUsageService featureUsageService) {

        this.interviewTopicRepository = interviewTopicRepository;

        this.interviewSessionRepository = interviewSessionRepository;

        this.interviewQuestionRepository = interviewQuestionRepository;

        this.interviewAnswerRepository = interviewAnswerRepository;

        this.interviewSkillRepository = interviewSkillRepository;

        this.openAIInterviewService = openAIInterviewService;

        this.objectMapper = objectMapper;
        
        this.featureUsageService = featureUsageService;
    }


    // =========================================================
    // GET ALL ACTIVE INTERVIEW TOPICS
    // =========================================================

    public List<InterviewTopicResponse> getActiveTopics() {

        return interviewTopicRepository
                .findByActiveTrueOrderByIdAsc()
                .stream()
                .map(topic ->
                        new InterviewTopicResponse(
                                topic.getId(),
                                topic.getName(),
                                topic.getDescription(),
                                topic.getIcon()
                        )
                )
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET SKILLS OF A PARTICULAR TOPIC
    // =========================================================

 // =========================================================
 // GET IMPORTANT SKILLS OF A PARTICULAR TOPIC
 // =========================================================

 public List<InterviewSkillResponse> getSkills(Long topicId) {

     // -----------------------------------------------------
     // 1. FIND TOPIC
     // -----------------------------------------------------

     InterviewTopic topic = interviewTopicRepository
             .findById(topicId)
             .orElseThrow(() ->
                     new RuntimeException(
                             "Interview topic not found"
                     )
             );

     // -----------------------------------------------------
     // 2. CHECK TOPIC ACTIVE
     // -----------------------------------------------------

     if (!topic.isActive()) {

         throw new RuntimeException(
                 "This interview topic is not active"
         );
     }

     // -----------------------------------------------------
     // 3. GET ALL ACTIVE SKILLS OF TOPIC
     // -----------------------------------------------------

     List<InterviewSkill> skills =
             interviewSkillRepository
                     .findByTopicIdAndActiveTrueOrderByNameAsc(topicId);

     // -----------------------------------------------------
     // 4. IMPORTANT TECHNICAL SKILLS
     // -----------------------------------------------------

     if (topicId.equals(2L)) {

         List<String> importantTechnicalSkills = List.of(

                 "Java",
                 "Core Java",
                 "Advanced Java",
                 "OOP",
                 "Collections",
                 "Exception Handling",
                 "Multithreading",
                 "Generics",
                 "Lambda Expressions",
                 "Streams API",
                 "Spring",
                 "Spring Boot",
                 "Spring MVC",
                 "Spring Security",
                 "Hibernate",
                 "JPA",
                 "REST API",
                 "SQL",
                 "DBMS",
                 "Data Structures"
         );

         skills = skills.stream()
                 .filter(skill ->
                         importantTechnicalSkills
                                 .contains(skill.getName())
                 )
                 .collect(Collectors.toList());
     }

     // -----------------------------------------------------
     // 5. IMPORTANT CODING SKILLS
     // -----------------------------------------------------

     else if (topicId.equals(3L)) {

         List<String> importantCodingSkills = List.of(

                 "Java",
                 "Python",
                 "C++",
                 "JavaScript",
                 "Arrays",
                 "Two Dimensional Arrays",
                 "Strings",
                 "String Manipulation",
                 "Linked List",
                 "Singly Linked List",
                 "Stack",
                 "Queue",
                 "Hashing",
                 "Recursion",
                 "Binary Search",
                 "Sorting",
                 "Binary Tree",
                 "Binary Search Tree",
                 "Graphs",
                 "Dynamic Programming"
         );

         skills = skills.stream()
                 .filter(skill ->
                         importantCodingSkills
                                 .contains(skill.getName())
                 )
                 .collect(Collectors.toList());
     }

     // -----------------------------------------------------
     // 6. CONVERT TO RESPONSE
     // -----------------------------------------------------

     return skills.stream()
             .map(skill ->
                     new InterviewSkillResponse(
                             skill.getId(),
                             skill.getName(),
                             skill.getDescription()
                     )
             )
             .collect(Collectors.toList());
 }


    // =========================================================
    // START AI INTERVIEW SESSION
    // =========================================================

    @Transactional
    public InterviewStartResponse startSession(

            InterviewStartRequest request,

            User student) {


        // -----------------------------------------------------
        // 1. VALIDATE TOPIC
        // -----------------------------------------------------

        if (request.getTopicId() == null) {

            throw new RuntimeException(
                    "Topic is required"
            );
        }


        // -----------------------------------------------------
        // 2. VALIDATE SKILLS
        // -----------------------------------------------------

        if (request.getSkillIds() == null ||
                request.getSkillIds().isEmpty()) {

            throw new RuntimeException(
                    "Please select at least one skill"
            );
        }


        // -----------------------------------------------------
        // 3. VALIDATE EXPERIENCE
        // -----------------------------------------------------

        if (request.getExperienceLevel() == null) {

            throw new RuntimeException(
                    "Experience level is required"
            );
        }


        // -----------------------------------------------------
        // 4. VALIDATE DIFFICULTY
        // -----------------------------------------------------

        if (request.getDifficulty() == null) {

            throw new RuntimeException(
                    "Difficulty level is required"
            );
        }


        // -----------------------------------------------------
        // 5. VALIDATE NUMBER OF QUESTIONS
        // -----------------------------------------------------

        if (request.getNumberOfQuestions() == null) {

            throw new RuntimeException(
                    "Number of questions is required"
            );
        }


        if (request.getNumberOfQuestions() < 1 ||
                request.getNumberOfQuestions() > 50) {

            throw new RuntimeException(
                    "Number of questions must be between 1 and 50"
            );
        }


        // -----------------------------------------------------
        // 6. FIND TOPIC
        // -----------------------------------------------------

        InterviewTopic topic =

                interviewTopicRepository
                        .findById(request.getTopicId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Interview topic not found"
                                )
                        );


        // -----------------------------------------------------
        // 7. CHECK TOPIC ACTIVE
        // -----------------------------------------------------

        if (!topic.isActive()) {

            throw new RuntimeException(
                    "This interview topic is not active"
            );
        }


        // -----------------------------------------------------
        // 8. FIND SELECTED SKILLS
        // -----------------------------------------------------

        List<InterviewSkill> selectedSkills =

                interviewSkillRepository
                        .findAllById(request.getSkillIds());


        // -----------------------------------------------------
        // 9. CHECK ALL SKILLS EXIST
        // -----------------------------------------------------

        if (selectedSkills.size() !=
                request.getSkillIds().size()) {

            throw new RuntimeException(
                    "One or more selected skills are invalid"
            );
        }


        // -----------------------------------------------------
        // 10. VALIDATE SKILLS
        // -----------------------------------------------------

        for (InterviewSkill skill : selectedSkills) {


            // Skill must be active

            if (!skill.isActive()) {

                throw new RuntimeException(
                        "Selected skill '" +
                        skill.getName() +
                        "' is inactive"
                );
            }


            // Skill must belong to selected topic

            if (skill.getTopic() == null ||
                    !skill.getTopic()
                            .getId()
                            .equals(topic.getId())) {

                throw new RuntimeException(
                        "Selected skill '" +
                        skill.getName() +
                        "' does not belong to topic '" +
                        topic.getName() +
                        "'"
                );
            }
        }

        featureUsageService.consumeInterviewUse(student.getEmail());

        // -----------------------------------------------------
        // 11. CREATE SESSION
        // -----------------------------------------------------

        InterviewSession session =
                new InterviewSession();


        session.setStudent(student);

        session.setTopic(topic);

        session.setSkills(selectedSkills);

        session.setExperienceLevel(
                request.getExperienceLevel()
        );

        session.setDifficulty(
                request.getDifficulty()
        );

        session.setTotalQuestions(
                request.getNumberOfQuestions()
        );

        session.setTotalScore(0);

        session.setMaxScore(
                request.getNumberOfQuestions() * 10
        );

        session.setPercentage(0.0);


        // -----------------------------------------------------
        // 12. SAVE SESSION
        // -----------------------------------------------------

        InterviewSession savedSession =

                interviewSessionRepository.save(session);


        // -----------------------------------------------------
        // 13. GENERATE AI QUESTIONS
        // -----------------------------------------------------

        openAIInterviewService.generateQuestions(
                savedSession
        );


        // -----------------------------------------------------
        // 14. RETURN RESPONSE
        // -----------------------------------------------------

        return new InterviewStartResponse(

                savedSession.getId(),

                topic.getName(),

                savedSession.getExperienceLevel(),

                savedSession.getDifficulty(),

                savedSession.getTotalQuestions(),

                savedSession.getStatus().name()
        );
    }


    // =========================================================
    // GET QUESTIONS
    // =========================================================

    public List<InterviewQuestionResponse> getQuestions(

            Long sessionId,

            User student) {


        // -----------------------------------------------------
        // 1. FIND SESSION
        // -----------------------------------------------------

        InterviewSession session =

                interviewSessionRepository
                        .findById(sessionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Interview session not found"
                                )
                        );


        // -----------------------------------------------------
        // 2. CHECK OWNERSHIP
        // -----------------------------------------------------

        if (!session.getStudent()
                .getId()
                .equals(student.getId())) {

            throw new RuntimeException(
                    "You are not allowed to access this interview"
            );
        }


        // -----------------------------------------------------
        // 3. GET QUESTIONS
        // -----------------------------------------------------

        List<InterviewQuestion> questions =

                interviewQuestionRepository
                        .findBySessionIdOrderByIdAsc(
                                sessionId
                        );


        // -----------------------------------------------------
        // 4. CONVERT TO RESPONSE
        // -----------------------------------------------------

        return questions.stream()

                .map(question -> {


                    List<String> options = null;


                    // Parse MCQ options

                    try {

                        if (question.getOptions() != null &&
                                !question.getOptions().isBlank()) {

                            options = objectMapper.readValue(

                                    question.getOptions(),

                                    new TypeReference<List<String>>() {}
                            );
                        }

                    } catch (Exception e) {

                        options = null;
                    }


                    return new InterviewQuestionResponse(
                            question.getId(),
                            question.getQuestion(),
                            question.getQuestionType().name(),
                            question.getDifficulty().name(),
                            question.getSkill() != null
                                    ? question.getSkill().getName()
                                    : null,
                            options,
                            question.getMaxScore()
                    );
                })

                .collect(Collectors.toList());
    }
}