
import { apiRequest } from "./api";

export const applyForjob = async (
    jobId,
    { resumeFile = null, useProfileResume = true } = {}
) => {
    try {
        const formData = new FormData();

        formData.append(
            "useProfileResume",
            String(useProfileResume)
        );

        // Attach a custom resume only when selected.
        // This file will be saved to the Application,
        // not to the student's profile.
        if (!useProfileResume && resumeFile) {
            formData.append("resume", resumeFile);
        }

        return await apiRequest(
            `/applications/${jobId}`,
            {
                method: "POST",
                body: formData
            }
        );

    } catch (error) {
        console.error("Apply API error:", error);
        throw error;
    }
};

export const getMyApplications = async () => {
    return await apiRequest(
        "/applications/my",
        {
            method: "GET"
        }
    );
};

export const getStudentApplications = async (studentId) => {
    return await apiRequest(
        "/applications/my",
        {
            method: "GET"
        }
    );
};

export const getApplicationById = async (id) => {
    return await apiRequest(
        `/applications/${id}`,
        {
            method: "GET"
        }
    );
};
