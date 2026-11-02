import { apiRequest } from "./api";

const API_BASE_URL = "http://localhost:8080/api";

export const getEmployerDashboard = async () => {
    return await apiRequest("/dashboard/employer");
};

export const getEmployerApplicants = async () => {
    const response = await apiRequest(
        "/employer/applicants/employer",
        {
            method: "GET"
        }
    );

    console.log("EMPLOYER APPLICANTS API RESPONSE:", response);

    return response;
};

export const getEmployerApplicant = async (id) => {
    return await apiRequest(`/employer/applicants/${id}`,
        {
            method: "GET"
        }
    );
};

export const updateApplicationStatus = async (id, status) => {
    return await apiRequest(
        `/employer/applicants/${id}/status?status=${status}`,
        {
            method: "PUT"
        }
    );
};

export const createJob = async (jobData) => {
    return await apiRequest(
        "/jobs",
        {
            method: "POST",
            body: JSON.stringify(jobData)
        }
    );
};

export const getEmployerJobs = async () => {
    return await apiRequest(
        "/jobs/employer",
        {
            method: "GET"
        }
    );
};

export const getJobById = async (jobId) => {
    return await apiRequest(
        `/jobs/${jobId}`,
        {
            method: "GET"
        }
    );
};

export const updateJob = async (jobId, jobData) => {
    return await apiRequest(
        `/jobs/${jobId}`,
        {
            method: "PUT",
            body: JSON.stringify(jobData)
        }
    );
};

export const updateJobStatus = async (id, active) => {

    return await apiRequest(`/jobs/${id}/status?active=${active}`,
        {
            method: "PUT"
        }
    );
};

export const getEmployerInterviews = async () => {
    return apiRequest("/employer/interviews");
};

export const scheduleInterview = async (interviewData) => {
    return await apiRequest("/employer/interviews", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(interviewData),
    });
};

export const getEmployerProfile = async () => {

    return apiRequest(
        "/employer/profile",
        {
            method: "GET"
        }
    );
};

export const updateEmployerProfile = async (
    profileData
) => {

    return apiRequest(
        "/employer/profile",
        {
            method: "PUT",
            body: JSON.stringify(profileData)
        }
    );
};


export const getEmployerProfileImage = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:8080/api/employer/profile/image",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to load profile image: ${response.status}`
        );
    }

    const blob = await response.blob();

    return URL.createObjectURL(blob);
};

export const uploadEmployerProfileImage = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    return await apiRequest(
        "/employer/profile/image",
        {
            method: "POST",
            body: formData
        }
    );
};

export const getStudentApplications = async (
    studentId
) => {
    return await apiRequest(
        `/employer/applicants/students/${studentId}/applications`,
        {
            method: "GET",
        }
    );
};

// =====================================================
// VIEW APPLICATION RESUME
// =====================================================

export const viewApplicationResume = async (applicationId) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please log in again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/employer/applicants/${applicationId}/resume`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Unable to load resume: ${response.status}`);
    }

    const blob = await response.blob();

    if (blob.size === 0) {
        throw new Error("The resume file is empty.");
    }

    // The browser can display PDFs directly.
    const contentType = response.headers.get("Content-Type") || "";

    if (!contentType.toLowerCase().includes("application/pdf")) {
        throw new Error(
            `This resume is not a PDF. Received file type: ${contentType || "unknown"}`
        );
    }

    return URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
    );
};


// =====================================================
// DOWNLOAD APPLICATION RESUME
// =====================================================


export const downloadApplicationResume = async (
    applicationId,
    fileName = "resume.pdf"
) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please log in again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/employer/applicants/${applicationId}/resume/download`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        console.error("Resume download failed:", {
            status: response.status,
            message: errorText,
        });

        throw new Error(
            errorText || `Unable to download resume: ${response.status}`
        );
    }

    const blob = await response.blob();

    if (!blob.size) {
        throw new Error("The resume file is empty.");
    }

    // Use the filename provided by the backend, if available.
    const disposition = response.headers.get(
        "Content-Disposition"
    );

    if (disposition) {
        const match = disposition.match(/filename="?([^";]+)"?/i);

        if (match && match[1]) {
            fileName = match[1];
        }
    }

    const fileURL = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = fileURL;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
        window.URL.revokeObjectURL(fileURL);
    }, 1000);
};


 // ==========================================
 // VIEW STUDENT PROFILE RESUME
 // ==========================================

export const viewStudentProfileResume = async (applicationId) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please log in again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/employer/applicants/${applicationId}/profile-resume`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `Unable to load profile resume: ${response.status}`
        );
    }

    const blob = await response.blob();

    if (!blob.size) {
        throw new Error("The profile resume file is empty.");
    }

    return URL.createObjectURL(blob);
};


// ==========================================
// DOWNLOAD STUDENT PROFILE RESUME
// ==========================================

export const downloadStudentProfileResume = async (
    applicationId,
    fileName = "profile-resume.pdf"
) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please log in again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/employer/applicants/${applicationId}/profile-resume/download`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `Unable to download profile resume: ${response.status}`
        );
    }

    const blob = await response.blob();

    if (!blob.size) {
        throw new Error("The profile resume file is empty.");
    }

    const disposition = response.headers.get("Content-Disposition");

    if (disposition) {
        const match = disposition.match(/filename="?([^";]+)"?/i);

        if (match?.[1]) {
            fileName = match[1];
        }
    }

    const fileURL = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = fileURL;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
        window.URL.revokeObjectURL(fileURL);
    }, 1000);
};


export const getApplicantProfileImage = async (studentId) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://localhost:8080/api/employer/applicants/${studentId}/image`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch applicant profile image");
    }

    return await response.blob();
};

export const getSmartCandidateMatches = async (jobId) => {
  return apiRequest(`/employer/jobs/${jobId}/smart-matches`, {
    method: "GET",
  });
};