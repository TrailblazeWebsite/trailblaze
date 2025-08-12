import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ApplicantLayout() {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;

    // Not logged in → send to login
    if (!user) return <Navigate to="/login" replace />;

    // If user is not an applicant → send them away
    if (profile.role !== "applicant") {
        // If they try to access pending-approval directly, send to home
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Applicant can see outlet without navbar
    return <Outlet />;
}
