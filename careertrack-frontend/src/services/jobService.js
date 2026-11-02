import { apiRequest } from "./api";

// =====================================================
// Get all active jobs - Student
// GET /api/jobs
// =====================================================

export const getJobs = async () => {
    return await apiRequest("/jobs", {
        method: "GET"
    });
};


// =====================================================
// Get single job
// GET /api/jobs/{id}
// =====================================================

export const getJobById = async (id) => {
    return await apiRequest(`/jobs/${id}`, {
        method: "GET"
    });
};


// =====================================================
// Search jobs
// GET /api/jobs/search?keyword=java
// =====================================================

export const searchJobs = async (keyword) => {
    return await apiRequest(
        `/jobs/search?keyword=${encodeURIComponent(keyword)}`,
        {
            method: "GET"
        }
    );
};


// =====================================================
// Get logged-in employer's jobs
// GET /api/jobs/employer
// =====================================================

export const getEmployerJobs = async () => {
    return await apiRequest("/jobs/employer", {
        method: "GET"
    });
};


// =====================================================
// Update job
// PUT /api/jobs/{id}
// =====================================================

export const updateJob = async (jobId, jobData) => {
    return await apiRequest(
        `/jobs/${jobId}`,
        {
            method: "PUT",
            body: JSON.stringify(jobData)
        }
    );
};


// =====================================================
// Activate / Deactivate job
// PUT /api/jobs/{id}/status?active=true/false
// =====================================================

export const updateJobStatus = async (jobId, active) => {
    return await apiRequest(
        `/jobs/${jobId}/status?active=${active}`,
        {
            method: "PUT"
        }
    );
};

// =====================================================
// Get public company profile by employer ID
// GET /api/company/employer/{employerId}
// =====================================================

export const getCompanyByEmployer = async (employerId) => {
    return await apiRequest(
        `/company/employer/${employerId}`,
        {
            method: "GET"
        }
    );
};