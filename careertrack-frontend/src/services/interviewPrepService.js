
import { apiRequest } from "./api";

// Get all interview categories
export const getInterviewPrepTopics = async () => {
    return await apiRequest("/interview-preparation/topics", {
        method: "GET"
    });
};

// Get skills belonging to a category
export const getInterviewPrepSkills = async (topicId) => {
    return await apiRequest(
        `/interview-preparation/topics/${topicId}/skills`,
        {
            method: "GET"
        }
    );
};

// Start AI interview
export const startInterviewPrep = async (data) => {
    return await apiRequest("/interview-preparation/start", {
        method: "POST",
        body: JSON.stringify(data)
    });
};

// Get questions
export const getInterviewPrepQuestions = async (sessionId) => {
    return await apiRequest(
        `/interview-preparation/${sessionId}/questions`,
        {
            method: "GET"
        }
    );
};

// Submit a single answer, if needed
export const submitInterviewPrepAnswer = async (
    sessionId,
    questionId,
    answer
) => {
    return await apiRequest(
        `/interview-preparation/${sessionId}/answer`,
        {
            method: "POST",
            body: JSON.stringify({
                questionId,
                answer
            })
        }
    );
};

// Complete interview and submit all answers
// answers must be an object: { questionId: answer }
export const completeInterviewPrep = async (sessionId, answers) => {
    return await apiRequest(
        `/interview-preparation/${sessionId}/complete`,
        {
            method: "POST",
            body: JSON.stringify(answers)
        }
    );
};

// Get result
export const getInterviewPrepResult = async (sessionId) => {
    return await apiRequest(
        `/interview-preparation/${sessionId}/result`,
        {
            method: "GET"
        }
    );
};

// Get scoreboard
export const getInterviewPrepScoreboard = async () => {
    return await apiRequest(
        "/interview-preparation/scoreboard",
        {
            method: "GET"
        }
    );
};
