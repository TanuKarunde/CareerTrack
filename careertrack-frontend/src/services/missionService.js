
const API_BASE_URL = "http://localhost:8080/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to access Mission Control.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const message = await response.text();

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "Access denied. Please log in with your student account."
      );
    }

    throw new Error(
      message || `Request failed with status ${response.status}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// GET: Fetch missions for a job
export const getMissions = async (jobId) => {
  const response = await fetch(
    `${API_BASE_URL}/mission-control/jobs/${jobId}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return handleResponse(response);
};

// POST: Generate AI missions
export const generateMissions = async (jobId) => {
  const response = await fetch(
    `${API_BASE_URL}/mission-control/jobs/${jobId}/generate`,
    {
      method: "POST",
      headers: getHeaders(),
    }
  );

  return handleResponse(response);
};

// // PATCH: Complete a mission
// export const completeMission = async (missionId) => {
//   const response = await fetch(
//     `${API_BASE_URL}/mission-control/missions/${missionId}/complete`,
//     {
//       method: "PATCH",
//       headers: getHeaders(),
//     }
//   );

//   return handleResponse(response);
// };

async function assessmentRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || data?.detail || "Assessment request failed."
    );
  }

  return data;
}

export const startAssessment = (missionId, questionCount) =>
  assessmentRequest(
    `/mission-control/missions/${missionId}/start?questionCount=${questionCount}`,
    { method: "POST" }
  );

export const submitAssessment = (missionId, answers) =>
  assessmentRequest(`/mission-control/missions/${missionId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
