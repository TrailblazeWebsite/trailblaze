import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
    const { profile, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!profile || profile.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}
