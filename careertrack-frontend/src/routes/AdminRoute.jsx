
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const normalizeRole = (role) =>
    String(role || "")
        .trim()
        .replace(/^ROLE_/i, "")
        .toUpperCase();

const AdminRoute = ({ children }) => {
    const { user } = useAuth();

    // Match the storage keys used by your AuthContext.
    const token =
        localStorage.getItem("careertrack_token") ||
        user?.token;

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    const role = normalizeRole(user.role || user.userRole);

    if (role !== "ADMIN") {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default AdminRoute;
