import { apiRequest } from "./api";

export const getStudentdashboard = async () => {
    return await apiRequest("/dashboard/student");
};

export const getUpcomingInterviews = async () => {
    return await apiRequest("/student/interviews/upcoming");
};

export const getAllStudentInterviews = async () => {
    return await apiRequest("/student/interviews");
};