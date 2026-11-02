import { apiRequest } from "./api";

const BASE_URL = "/notifications";

export const getNotifications = (page = 0, size = 20) => {
    return apiRequest(
        `${BASE_URL}?page=${page}&size=${size}`,
        {
            method: "GET",
        }
    );
};

export const getUnreadNotificationCount = () => {
    return apiRequest(`${BASE_URL}/unread-count`, {
        method: "GET",
    });
};

export const markNotificationAsRead = (notificationId) => {
    return apiRequest(`${BASE_URL}/${notificationId}/read`, {
        method: "PATCH",
    });
};

export const markAllNotificationsAsRead = () => {
    return apiRequest(`${BASE_URL}/read-all`, {
        method: "PATCH",
    });
};

export const deleteNotification = (notificationId) => {
    return apiRequest(`${BASE_URL}/${notificationId}`, {
        method: "DELETE",
    });
};