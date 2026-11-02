
import { apiRequest } from "./api";

export const getAdminDashboard = async () => {
    return apiRequest("/admin/dashboard");
};

export const getAdminUsers = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.search?.trim()) {
        params.set("search", filters.search.trim());
    }

    if (filters.role && filters.role !== "ALL") {
        params.set("role", filters.role);
    }

    const query = params.toString();

    return apiRequest(
        `/admin/users${query ? `?${query}` : ""}`
    );
};

export const getAdminCompanies = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.search?.trim()) {
        params.set("search", filters.search.trim());
    }

    if (filters.status && filters.status !== "ALL") {
        params.set("status", filters.status);
    }

    const query = params.toString();

    return apiRequest(
        `/admin/companies${query ? `?${query}` : ""}`
    );
};

export const updateCompanyVerification = async (
    companyId,
    status,
    note = null
) => {
    return apiRequest(`/admin/companies/${companyId}/verification`, {
        method: "PATCH",
        body: JSON.stringify({ status, note }),
    });
};

// Add these functions at the bottom of src/services/adminService.js

export const getAdminJobs = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.search?.trim()) {
        params.set("search", filters.search.trim());
    }

    if (filters.status && filters.status !== "ALL") {
        params.set("status", filters.status);
    }

    if (filters.jobType && filters.jobType !== "ALL") {
        params.set("jobType", filters.jobType);
    }

    const query = params.toString();

    return apiRequest(`/admin/jobs${query ? `?${query}` : ""}`);
};

export const getAdminJob = async (id) => {
    return apiRequest(`/admin/jobs/${id}`);
};

export const updateAdminJobStatus = async (id, active) => {
    return apiRequest(
        `/admin/jobs/${id}/status?active=${active}`,
        { method: "PATCH" }
    );
};

export const getAdminAnalytics = () =>
apiRequest("/admin/analytics");


// Announcement 

const BASE_URL = "/admin/announcements";

// Get all announcements
export const getAdminAnnouncements = () =>
    apiRequest(BASE_URL);

// Get one announcement
export const getAdminAnnouncementById = (id) =>
    apiRequest(`${BASE_URL}/${id}`);

// Create a draft announcement
export const createAdminAnnouncement = (announcement) =>
    apiRequest(BASE_URL, {
        method: "POST",
        body: JSON.stringify(announcement),
    });

// Update an announcement
export const updateAdminAnnouncement = (id, announcement) =>
    apiRequest(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(announcement),
    });

// Publish an announcement
export const publishAdminAnnouncement = (id) =>
    apiRequest(`${BASE_URL}/${id}/publish`, {
        method: "PATCH",
    });

// Unpublish an announcement
export const unpublishAdminAnnouncement = (id) =>
    apiRequest(`${BASE_URL}/${id}/unpublish`, {
        method: "PATCH",
    });

// Delete an announcement
export const deleteAdminAnnouncement = (id) =>
    apiRequest(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

// Get announcement summary
export const getAdminAnnouncementSummary = () =>
    apiRequest(`${BASE_URL}/summary`);

