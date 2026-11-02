const API_BASE_URL = "http://localhost:8080/api";

export const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    // Check whether request body is FormData
    const isFormData = options.body instanceof FormData;

    const headers = {
        ...(token && {
            Authorization: `Bearer ${token}`
        }),

        ...options.headers
    };

    // Only set JSON Content-Type for normal JSON requests
    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    
    // Read response body only once
    const responseText = await response.text();

    let data = null;

    try {
        data = responseText ? JSON.parse(responseText) : null;
    } catch {
        data = responseText;
    }

    console.log("API Request:", `${API_BASE_URL}${endpoint}`);
    console.log("API Status:", response.status);
    console.log("Token exists:", Boolean(token));

    if (!response.ok) {
        console.error("API Error Response:", data);

        const error = new Error(
            typeof data === "object" && data !== null
                ? data.message ||
                  data.error ||
                  data.detail ||
                  `HTTP Error: ${response.status}`
                : data || `HTTP Error: ${response.status}`
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }


    if (data?.token) {
        localStorage.setItem("token", data.token);
        console.log("Token saved");
    }

    return data;
};