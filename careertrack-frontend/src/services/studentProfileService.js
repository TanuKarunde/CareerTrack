import { apiRequest } from "./api";

export const getStudentProfile = async () => {
    return await apiRequest("/student/profile", {
        method: "GET"
    });
};

export const updateStudentProfile = async (profileData) => {
    return await apiRequest("/student/profile", {
        method: "PUT",
        body: JSON.stringify(profileData)
    });
};

export const uploadStudentProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return await apiRequest("/student/profile/image", {
        method: "PUT",
        body: formData
    });
};

export const uploadStudentResume = async (file) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("You are not logged in");
    }

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        "http://localhost:8080/api/student/profile/resume",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            "Failed to upload resume"
        );
    }

    return data;
};