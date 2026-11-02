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


export const uploadEmployerProfileImage = async (
    file
) => {

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${API_BASE_URL}/employer/profile/image`,
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`
            },

            body: formData
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            data.error ||
            "Failed to upload profile image."
        );
    }

    return data;
};