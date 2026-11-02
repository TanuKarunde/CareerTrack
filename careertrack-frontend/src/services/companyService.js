import { apiRequest } from "./api";

// =====================================================
// CREATE COMPANY
// =====================================================

export const createCompany = async (companyData) => {

    return await apiRequest("/company", {
        method: "POST",
        body: JSON.stringify(companyData)
    });

};

// =====================================================
// JOIN EXISTING COMPANY
// =====================================================

export const joinCompany = async (website) => {

    return await apiRequest("/company/join", {
        method: "POST",
        body: JSON.stringify({
            website: website
        })
    });

};

// =====================================================
// GET MY COMPANY
// =====================================================

export const getCompanyProfile = async () => {

    return await apiRequest("/company", {
        method: "GET"
    });

};


// =====================================================
// UPDATE MY COMPANY
// =====================================================

export const updateCompanyProfile = async (companyData) => {

    return await apiRequest("/company", {
        method: "PUT",
        body: JSON.stringify(companyData)
    });

};

export const uploadCompanyLogo = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    return await apiRequest(
        "/company/logo",
        {
            method: "POST",
            body: formData
        }
    );
};


export const getCompanyLogo = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:8080/api/company/logo",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {

        if (response.status === 404) {
            return null;
        }

        throw new Error(
            `Failed to load company logo: ${response.status}`
        );
    }

    const blob = await response.blob();

    return URL.createObjectURL(blob);
};