
import { apiRequest } from "./api";

export const getFeatureUsageStatus = async () => {
    return await apiRequest("/feature-usage/status", {
        method: "GET",
    });
};
