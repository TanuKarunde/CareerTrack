
import { apiRequest } from "./api";

// Mark one announcement as read for the logged-in user.
export const markAnnouncementAsRead = async (announcementId) => {
    return await apiRequest(
        `/announcements/${announcementId}/read`,
        {
            method: "PUT"
        }
    );
};

// Get read/unread status for one announcement.
export const getAnnouncementReadStatus = async (announcementId) => {
    return await apiRequest(
        `/announcements/${announcementId}/read-status`,
        {
            method: "GET"
        }
    );
};

// Get all read statuses for the logged-in user.
export const getAnnouncementReadStatuses = async () => {
    return await apiRequest(
        "/announcements/read-statuses",
        {
            method: "GET"
        }
    );
};


export const markAllAnnouncementsAsRead = async () => {
    return await apiRequest("/announcements/read-all", {
        method: "PUT",
    });
};
