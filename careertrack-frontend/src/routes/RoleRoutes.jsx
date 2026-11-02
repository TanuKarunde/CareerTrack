
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

const normalizeRole = (role) => {
    return String(role || "")
        .trim()
        .replace(/^ROLE_/i, "")
        .toUpperCase();
};

const RoleRoutes = ({ allowedRole }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const currentRole = normalizeRole(
        user.role || user.userRole
    );

    const requiredRole = normalizeRole(allowedRole);

    if (currentRole !== requiredRole) {
        console.error("Role access denied:", {
            currentRole,
            requiredRole,
            user,
        });

        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default RoleRoutes;
