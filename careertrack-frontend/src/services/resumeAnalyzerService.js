import { apiRequest } from "./api";

// Analyze an uploaded resume or the resume saved in the student profile.
// The backend compares the resume with all active jobs.
export const analyzeResume = async ({ file } = {}) => {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  return apiRequest("/resume-analyzer/analyze", {
    method: "POST",
    body: formData,
  });
};

// Fetch the logged-in student's analysis history.
export const getResumeAnalysisHistory = async () => {
  return apiRequest("/resume-analyzer/history", {
    method: "GET",
  });
};

// Fetch one report by its analysis ID.
export const getResumeAnalysisReport = async (analysisId) => {
  return apiRequest(
    `/resume-analyzer/${encodeURIComponent(analysisId)}`,
    {
      method: "GET",
    }
  );
};

// Delete a single report.
export const deleteResumeAnalysisReport = async (analysisId) => {
  return apiRequest(
    `/resume-analyzer/${encodeURIComponent(analysisId)}`,
    {
      method: "DELETE",
    }
  );
};

// Delete all reports belonging to the logged-in student.
export const deleteResumeAnalysisHistory = async () => {
  return apiRequest("/resume-analyzer/history", {
    method: "DELETE",
  });
};