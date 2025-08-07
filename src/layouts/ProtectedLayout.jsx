import { Outlet } from "react-router-dom";
import { UserLocationProvider } from "../context/UserLocationContext.jsx";
import Wrapper from "../pages/Wrapper.jsx";

export default function ProtectedLayout() {
    return (
        <Wrapper>
            <UserLocationProvider>
                <Outlet />
            </UserLocationProvider>
        </Wrapper>
    );
}
