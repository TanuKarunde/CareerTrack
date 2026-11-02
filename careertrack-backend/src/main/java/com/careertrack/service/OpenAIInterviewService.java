package com.careertrack.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.careertrack.dto.AIAnswerEvaluation;
import com.careertrack.dto.AIQuestionResponse;
import com.careertrack.dto.AIQuestionResponse.AIQuestion;
import com.careertrack.dto.CareerMissionAiResponse;
import com.careertrack.entity.DifficultyLevel;
import com.careertrack.entity.InterviewQuestion;
import com.careertrack.entity.InterviewSession;
import com.careertrack.entity.InterviewSkill;
import com.careertrack.entity.QuestionType;
import com.careertrack.repository.InterviewQuestionRepository;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;


@Service
public class OpenAIInterviewService {

    private final RestClient restClient;
    private final InterviewQuestionRepository questionRepository;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    public OpenAIInterviewService(
            RestClient openAIRestClient,
            InterviewQuestionRepository questionRepository,
            ObjectMapper objectMapper) {

        this.restClient = openAIRestClient;
        this.questionRepository = questionRepository;
        this.objectMapper = objectMapper;
    }

    public List<InterviewQuestion> generateQuestions(
            InterviewSession session) {

        // Get selected skills from the session

        List<InterviewSkill> selectedSkills =
                session.getSkills();

        if (selectedSkills == null ||
                selectedSkills.isEmpty()) {

            throw new RuntimeException(
                    "No skills selected for this interview"
            );
        }


        // Create skill list for OpenAI

        String skillList = selectedSkills.stream()
                .map(InterviewSkill::getName)
                .collect(Collectors.joining(", "));


        // Build AI prompt

        String prompt =
                buildPrompt(
                        session, skillList
                );


        // Call OpenAI

        String response = restClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/models/{model}:generateContent")
                        .queryParam("key", apiKey)
                        .build(model))
                .contentType(MediaType.APPLICATION_JSON)
                .body(buildRequest(prompt))
                .retrieve()
                .body(String.class);


        try {

            JsonNode root =
                    objectMapper.readTree(response);


            String outputText =
                    extractOutputText(root);
            
            outputText = cleanJson(outputText);
            
            AIQuestionResponse aiResponse =
                    objectMapper.readValue(
                            outputText,
                            AIQuestionResponse.class
                    );


            if (aiResponse.getQuestions() == null ||
                    aiResponse.getQuestions().isEmpty()) {

                throw new RuntimeException(
                        "OpenAI did not generate any questions"
                );
            }


            return saveQuestions(
                    session,
                    aiResponse,
                    selectedSkills
            );


        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate interview questions from OpenAI",
                    e
            );
        }
    }
    

    private String buildPrompt(InterviewSession session, String skillList) {

        String topic = session.getTopic().getName();

        String experience =
                session.getExperienceLevel().name();

        String difficulty =
                session.getDifficulty().name();

        int numberOfQuestions =
                session.getTotalQuestions();

        return """
                You are an expert interviewer creating an AI Interview Prep practice session.

                Generate interview preparation questions for a student.

                Topic:
                %s

                SELECTED SKILLS:
                %s

                Experience Level:
                %s

                Difficulty:
                %s

                Number of Questions:
                %d

                VERY IMPORTANT SKILL RULES:

                1. Generate questions ONLY from the SELECTED SKILLS listed above.
                2. Do NOT generate questions from any skill that is not selected.
                3. Every question MUST belong to exactly ONE selected skill.
                4. The "skill" field in every question MUST contain the exact name
                   of one of the SELECTED SKILLS.
                5. Distribute questions as evenly as possible among the selected skills.
                6. If the number of questions is not evenly divisible by the number
                   of selected skills, distribute the remaining questions among
                   the skills as evenly as possible.
                7. Do not invent new skill names.
                8. Do not use the topic name as the skill unless it is explicitly
                   present in the selected skills.
                9. Avoid duplicate questions.

                GENERAL QUESTION RULES:

10. Questions must be relevant to the selected topic.
11. Questions must match the student's experience level.
12. Questions must match the requested difficulty.
13. Questions should resemble real interview questions.
14. For MCQ questions provide exactly 4 options.
15. For descriptive questions options must be an empty array.
16. Provide the correct answer.
17. Provide a short explanation.
18. Every question has a maximum score of 10.

CODING QUESTION RULES:

19. If the questionType is CODING, the question MUST require
    the student to write actual code or implement a program/function.

20. CODING questions must be programming problems, not theoretical questions.

21. CODING questions should use wording such as:
    "Write a program",
    "Write a function",
    "Implement",
    "Write code to",
    or similar programming instructions.

22. Do NOT create a CODING question that only asks:
    - What is the time complexity?
    - What is the space complexity?
    - What is the definition of...?
    - Explain a concept.
    - Which algorithm should be used?
    - What is the output? without requiring code.

23. For CODING questions, the student must be expected
    to provide a code-based solution.

24. For CODING questions, include a clear problem statement
    and provide input/output examples when appropriate.

25. For CODING questions, options must be an empty array.

26. For CODING questions, the correctAnswer field should contain
    the expected solution or solution explanation.

27. Examples of valid CODING questions:
    - Write a Java program to reverse an array.
    - Write a function to find the largest element in an array.
    - Write a Java program to check whether a string is a palindrome.
    - Implement a function to reverse a linked list.
    - Write a program to find duplicate elements in an array.
    
    28. Every CODING question MUST contain all required input data
    needed to solve the problem.

29. If the question refers to an array, string, matrix, linked list,
    numbers, or any other specific input, the actual input data
    MUST be provided in the question.

30. Never write a CODING question that says:
    "given an array" without actually providing the array.

31. For array problems, provide a concrete example array, for example:
    [3, 0, 1, 4]

32. For string problems, provide the actual string when a specific
    input is required, for example:
    "madam"

33. For matrix problems, provide the actual matrix.

34. For numerical problems, provide the required input values.

35. The question must be completely understandable and solvable
    without the student having to invent or assume missing input data.

36. Include sample input and expected output whenever appropriate.

37. Example of a valid coding question:

    "Write a Java program to find the missing number in the following
    array containing numbers from 0 to n:

    Array: [3, 0, 1]

    Expected Output: 2"

38. Example of an invalid coding question:

    "Write a Java program to find the missing number from an array."

    This is invalid because no actual input array is provided.

                Allowed question types:

                MCQ
                DESCRIPTIVE
                CODING
                HR
                BEHAVIORAL

                Return ONLY valid JSON.
                Do not return markdown.
                Do not return ```json.
                Do not add any text before or after the JSON.

                Required JSON format:

                {
                  "questions": [
                    {
                      "question": "question text",
                      "questionType": "MCQ",
                      "difficulty": "MEDIUM",
                      "skill": "Exact Selected Skill Name",
                      "options": [
                        "Option A",
                        "Option B",
                        "Option C",
                        "Option D"
                      ],
                      "correctAnswer": "Option A",
                      "explanation": "Short explanation"
                    }
                  ]
                }
                """.formatted(
                        topic,
                        skillList,
                        experience,
                        difficulty,
                        numberOfQuestions
                );
    }

    private String buildRequest(String prompt) {
        try {
            return objectMapper.writeValueAsString(
                    java.util.Map.of(
                            "contents",
                            java.util.List.of(
                                    java.util.Map.of(
                                            "parts",
                                            java.util.List.of(
                                                    java.util.Map.of(
                                                            "text", prompt
                                                    )
                                            )
                                    )
                            )
                    )
            );
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to create Gemini request",
                    e
            );
        }
    }
    
    private String toJson(String text) {

        try {

            return objectMapper.writeValueAsString(text);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to create OpenAI request",
                    e
            );
        }
    }

    private String extractOutputText(JsonNode root) {

        JsonNode candidates = root.get("candidates");

        if (candidates == null ||
                !candidates.isArray() ||
                candidates.isEmpty()) {

            throw new RuntimeException(
                    "Gemini response does not contain candidates"
            );
        }

        JsonNode parts = candidates
                .get(0)
                .path("content")
                .path("parts");

        if (!parts.isArray() || parts.isEmpty()) {
            throw new RuntimeException(
                    "Gemini response does not contain text"
            );
        }

        StringBuilder result = new StringBuilder();

        for (JsonNode part : parts) {

            JsonNode text = part.get("text");

            if (text != null && text.isTextual()) {
                result.append(text.asText());
            }
        }

        if (result.isEmpty()) {
            throw new RuntimeException(
                    "Gemini returned empty output"
            );
        }

        return result.toString();
    }

    private List<InterviewQuestion> saveQuestions(

            InterviewSession session,

            AIQuestionResponse aiResponse,

            List<InterviewSkill> selectedSkills) {


        List<InterviewQuestion> questions =
                new ArrayList<>();


        for (AIQuestion aiQuestion :
                aiResponse.getQuestions()) {


            // Find the skill returned by AI

            InterviewSkill matchedSkill =
                    findMatchingSkill(
                            aiQuestion.getSkill(),
                            selectedSkills
                    );


            InterviewQuestion question =
                    new InterviewQuestion();


            question.setSession(session);


            // IMPORTANT:
            // Store the skill with the question

            question.setSkill(matchedSkill);


            question.setQuestion(
                    aiQuestion.getQuestion()
            );


            question.setQuestionType(
                    parseQuestionType(
                            aiQuestion.getQuestionType()
                    )
            );


            question.setDifficulty(
                    parseDifficulty(
                            aiQuestion.getDifficulty()
                    )
            );


            // Store MCQ options

            if (aiQuestion.getOptions() != null &&
                    !aiQuestion.getOptions().isEmpty()) {

                question.setOptions(

                        objectMapper
                                .valueToTree(
                                        aiQuestion.getOptions()
                                )
                                .toString()
                );

            } else {

                question.setOptions(null);
            }


            // IMPORTANT:
            // correctAnswer stays in database.
            // It will NOT be sent to frontend.

            question.setCorrectAnswer(
                    aiQuestion.getCorrectAnswer()
            );


            question.setExplanation(
                    aiQuestion.getExplanation()
            );


            question.setMaxScore(10);


            questions.add(
                    questionRepository.save(question)
            );
        }


        return questions;
    }

    private QuestionType parseQuestionType(
            String type) {

        if (type == null) {
            return QuestionType.DESCRIPTIVE;
        }

        try {

            return QuestionType.valueOf(
                    type.toUpperCase()
            );

        } catch (Exception e) {

            return QuestionType.DESCRIPTIVE;
        }
    }
    
    private DifficultyLevel parseDifficulty(
            String difficulty) {

        if (difficulty == null) {
            return DifficultyLevel.MEDIUM;
        }

        try {

            return DifficultyLevel.valueOf(
                    difficulty.toUpperCase()
            );

        } catch (Exception e) {

            return DifficultyLevel.MEDIUM;
        }
    }
    
    public AIAnswerEvaluation evaluateAnswer(
            InterviewQuestion question,
            String studentAnswer) {

        String prompt = """
                You are an expert interviewer evaluating a student's interview answer.

                Question:
                %s

                Question Type:
                %s

                Difficulty:
                %s

                Correct / Expected Answer:
                %s

                Student Answer:
                %s

                Evaluate the student's answer fairly.

                Give a score from 0 to 10.

                Scoring guidelines:

                0-2:
                Completely incorrect or irrelevant.

                3-4:
                Shows very limited understanding.

                5-6:
                Partially correct and demonstrates basic understanding.

                7-8:
                Mostly correct with good understanding.

                9:
                Very strong answer with minor missing details.

                10:
                Excellent and complete answer.

                Evaluate based on correctness, relevance,
understanding and completeness.

IMPORTANT OUTPUT RULES:

- Return ONLY valid JSON.
- Do NOT use Markdown.
- Do NOT wrap the JSON inside ```json.
- Do NOT use ``` at the beginning or end.
- Do NOT add any text before the JSON.
- Do NOT add any text after the JSON.
- The score must be an integer from 0 to 10.

Required format:

{
  "score": 8,
  "feedback": "Your answer correctly explains...",
  "idealAnswer": "A complete answer would be...",
  "missingPoints": "You did not mention..."
}
                """.formatted(
                question.getQuestion(),
                question.getQuestionType().name(),
                question.getDifficulty().name(),
                question.getCorrectAnswer(),
                studentAnswer
        );

        String response = restClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/models/{model}:generateContent")
                        .queryParam("key", apiKey)
                        .build(model))
                .contentType(MediaType.APPLICATION_JSON)
                .body(buildRequest(prompt))
                .retrieve()
                .body(String.class);

        try {

            JsonNode root =
                    objectMapper.readTree(response);

            String outputText =
                    extractOutputText(root);

            outputText =
                    cleanJson(outputText);

            return objectMapper.readValue(
                    outputText,
                    AIAnswerEvaluation.class
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to evaluate answer using Gemini",
                    e
            );
        }
    }
    
    
    private InterviewSkill findMatchingSkill(
            String aiSkill,
            List<InterviewSkill> selectedSkills) {

        if (aiSkill == null || aiSkill.isBlank()) {

            throw new RuntimeException(
                    "AI did not provide a skill for a question"
            );
        }

        return selectedSkills.stream()

                .filter(skill ->
                        skill.getName()
                                .equalsIgnoreCase(
                                        aiSkill.trim()
                                )
                )

                .findFirst()

                .orElseThrow(() ->
                        new RuntimeException(
                                "AI generated an invalid skill: "
                                        + aiSkill
                        )
                );
    }
    
    private String cleanJson(String response) {

        if (response == null) {
            throw new RuntimeException(
                    "Empty response from AI"
            );
        }

        response = response.trim();

        if (response.startsWith("```json")) {
            response = response.substring(7);
        }

        if (response.startsWith("```")) {
            response = response.substring(3);
        }

        if (response.endsWith("```")) {
            response = response.substring(
                    0,
                    response.length() - 3
            );
        }

        return response.trim();
    }
    
    public CareerMissionAiResponse generateCareerMissions(
            String studentContext) {

        if (studentContext == null || studentContext.isBlank()) {
            throw new IllegalArgumentException(
                    "Student readiness data is required"
            );
        }

        String prompt = """
                You are CareerTrack Mission Control, an expert career
                mentor for students preparing for software development jobs.

                Generate 5 personalized career missions using ONLY the
                actual student information provided below.

                STUDENT DATA:
                %s

                REQUIREMENTS:

                1. Prioritize skills listed as missing from the target job.
                2. Consider the student's current projects and project gaps.
                3. Generate practical, achievable tasks, not generic advice.
                4. Include a mix of SKILL, CODING, PROJECT, and INTERVIEW
                   missions when relevant to the student's needs.
                5. Do not claim that the student has skills or experience
                   that are not supported by the supplied data.
                6. Each mission must have a clear, actionable description.
                7. Every mission must have a targetSkill relevant to the
                   student's target job or an explicitly identified gap.
                8. estimatedMinutes must be between 10 and 180.
                9. xpReward must be between 10 and 100.
                10. Do not include a completion status; the backend
                    manages mission completion.
                11. Do not generate duplicate or nearly identical missions.
                12. Never invent a readiness score or claim that readiness
                    has improved.
                13. If a required skill is missing, prioritize learning
                    and demonstrating it through practical work.

                ALLOWED missionType VALUES:
                SKILL, CODING, PROJECT, INTERVIEW, PROFILE

                Return ONLY valid JSON. Do not include Markdown fences,
                comments, or explanatory text outside the JSON.

                Required response format:
                {
                  "missions": [
                    {
                      "title": "Practice Spring Boot REST APIs",
                      "description": "Create a GET endpoint and test it
                      using Postman. Include validation and an appropriate
                      HTTP response.",
                      "missionType": "CODING",
                      "targetSkill": "Spring Boot",
                      "estimatedMinutes": 45,
                      "xpReward": 50
                    }
                  ]
                }
                """.formatted(studentContext);

        try {
            String response = restClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/models/{model}:generateContent")
                            .queryParam("key", apiKey)
                            .build(model))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(buildRequest(prompt))
                    .retrieve()
                    .body(String.class);

            if (response == null || response.isBlank()) {
                throw new IllegalStateException(
                        "Gemini returned an empty response"
                );
            }

            JsonNode root = objectMapper.readTree(response);

            String outputText = cleanJson(extractOutputText(root));

            CareerMissionAiResponse result =
                    objectMapper.readValue(
                            outputText,
                            CareerMissionAiResponse.class
                    );

            if (result.getMissions() == null
                    || result.getMissions().isEmpty()) {
                throw new IllegalStateException(
                        "Gemini did not generate any missions"
                );
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to generate CareerTrack missions using Gemini",
                    e
            );
        }
    }
    

public List<com.careertrack.dto.AIAssessmentResponse.AIQuestion>
generateAssessmentQuestions(
        int questionCount,
        String targetSkill,
        String missionTitle,
        String missionDescription) {

    if (questionCount != 50 && questionCount != 100) {
        throw new IllegalArgumentException(
                "Question count must be 50 or 100"
        );
    }

    List<com.careertrack.dto.AIAssessmentResponse.AIQuestion>
            allQuestions = new ArrayList<>();

    Set<String> seenQuestions = new java.util.HashSet<>();

    while (allQuestions.size() < questionCount) {

        int batchSize = Math.min(
                10,
                questionCount - allQuestions.size()
        );

        String previousQuestions = allQuestions.stream()
                .map(q -> q.question())
                .collect(Collectors.joining("\n"));

        String prompt = """
                You are an expert technical assessment creator for CareerTrack.

                Generate exactly %d multiple-choice questions for this mission.

                Mission title: %s
                Target skill: %s
                Mission description: %s

                Generate clear, technically accurate questions appropriate
                for a software developer job seeker. Cover relevant concepts
                and practical scenarios for the target skill.

                Avoid repeating these previously generated questions:
                %s

                RULES:
                1. Return exactly %d questions.
                2. Every question must have exactly four options.
                3. Each option must begin with its letter, for example:
                   "A. ...", "B. ...", "C. ...", "D. ...".
                4. correctAnswer must be only A, B, C, or D.
                5. Exactly one option must be correct.
                6. Every question must have marks set to 1.
                7. Every question must have a specific topic.
                8. Questions must be distinct and relevant to the target skill.
                9. Do not include explanations or text outside the JSON.
                10. Do not reveal the answer in the question text.

                Return ONLY JSON in this exact structure:
                {
                  "questions": [
                    {
                      "topic": "Core Java",
                      "question": "Question text?",
                      "options": [
                        "A. First option",
                        "B. Second option",
                        "C. Third option",
                        "D. Fourth option"
                      ],
                      "correctAnswer": "B",
                      "marks": 1
                    }
                  ]
                }
                """.formatted(
                batchSize,
                missionTitle,
                targetSkill,
                missionDescription,
                previousQuestions.isBlank()
                        ? "None yet."
                        : previousQuestions,
                batchSize
        );

        try {
            String response = restClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/models/{model}:generateContent")
                            .queryParam("key", apiKey)
                            .build(model))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(buildRequest(prompt))
                    .retrieve()
                    .body(String.class);

            if (response == null || response.isBlank()) {
                throw new IllegalStateException(
                        "Gemini returned an empty assessment response"
                );
            }

            JsonNode root = objectMapper.readTree(response);

            String outputText = cleanJson(extractOutputText(root));

            com.careertrack.dto.AIAssessmentResponse result =
                    objectMapper.readValue(
                            outputText,
                            com.careertrack.dto.AIAssessmentResponse.class
                    );

            if (result.questions() == null
                    || result.questions().size() != batchSize) {
                throw new IllegalStateException(
                        "Gemini returned an incorrect number of questions"
                );
            }

            for (var question : result.questions()) {

                if (question == null
                        || question.topic() == null
                        || question.topic().isBlank()
                        || question.question() == null
                        || question.question().isBlank()
                        || question.options() == null
                        || question.options().size() != 4
                        || question.correctAnswer() == null
                        || question.marks() == null
                        || question.marks() != 1) {

                    throw new IllegalStateException(
                            "Gemini returned an invalid assessment question"
                    );
                }

                String answer = question.correctAnswer()
                        .trim()
                        .toUpperCase(java.util.Locale.ROOT);

                if (!Set.of("A", "B", "C", "D").contains(answer)) {
                    throw new IllegalStateException(
                            "AI answer must be A, B, C, or D"
                    );
                }

                Set<String> optionLetters = new java.util.HashSet<>();

                for (int i = 0; i < question.options().size(); i++) {
                    String option = question.options().get(i);

                    if (option == null || option.isBlank()) {
                        throw new IllegalStateException(
                                "AI returned an empty option"
                        );
                    }

                    String expectedPrefix =
                            String.valueOf((char) ('A' + i)) + ".";

                    if (!option.trim().startsWith(expectedPrefix)) {
                        throw new IllegalStateException(
                                "Options must start with A., B., C., and D."
                        );
                    }

                    optionLetters.add(expectedPrefix.substring(0, 1));
                }

                if (!optionLetters.contains(answer)) {
                    throw new IllegalStateException(
                            "Correct answer does not match an option"
                    );
                }

                String normalizedQuestion = question.question()
                        .trim()
                        .toLowerCase(java.util.Locale.ROOT);

                if (!seenQuestions.add(normalizedQuestion)) {
                    throw new IllegalStateException(
                            "AI generated a duplicate question. Please retry."
                    );
                }

                allQuestions.add(
                        new com.careertrack.dto.AIAssessmentResponse.AIQuestion(
                                question.topic().trim(),
                                question.question().trim(),
                                question.options(),
                                answer,
                                1
                        )
                );
            }

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to generate AI assessment questions with Gemini",
                    e
            );
        }
    }

    return allQuestions;
}

    
}