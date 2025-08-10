import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireRole({ children, allowedRoles }) {
    const { profile, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!profile || !allowedRoles.includes(profile.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
