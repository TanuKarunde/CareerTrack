import { apiRequest } from "./api";

// =====================================================
// Calculate Job Readiness Score
// POST /api/readiness/jobs/{jobId}/calculate
// =====================================================

export const calculateReadiness = async (jobId) => {
    return await apiRequest(
        `/readiness/jobs/${jobId}/calculate`,
        {
            method: "POST"
        }
    );
};


// =====================================================
// Get saved Job Readiness Report
// GET /api/readiness/jobs/{jobId}
// =====================================================

export const getReadiness = async (jobId) => {
    return await apiRequest(
        `/readiness/jobs/${jobId}`,
        {
            method: "GET"
        }
    );
};


// =====================================================
// Get logged-in student's Readiness History
// GET /api/readiness/history
// =====================================================

export const getReadinessHistory = async () => {
    return await apiRequest(
        "/readiness/history",
        {
            method: "GET"
        }
    );
};
