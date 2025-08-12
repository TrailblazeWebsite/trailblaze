import {Navigate, Outlet} from "react-router-dom";
import { UserLocationProvider } from "../context/UserLocationContext.jsx";
import Wrapper from "../pages/Wrapper.jsx";
import {useAuth} from "../context/AuthContext";

export default function ProtectedLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to='/login' ></Navigate>
    }

    if (user.role === "applicant") return <Navigate to="/pending-approval" replace />;

    return (
        <Wrapper>
            <UserLocationProvider>
                <Outlet />
            </UserLocationProvider>
        </Wrapper>
    );
}
