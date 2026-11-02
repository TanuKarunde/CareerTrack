
import { apiRequest } from "./api";

// Fetch published announcements for the logged-in student
export const getStudentAnnouncements = () =>
    apiRequest("/announcements/student");

// Fetch published announcements for the logged-in employer
export const getEmployerAnnouncements = () =>
    apiRequest("/announcements/employer");
