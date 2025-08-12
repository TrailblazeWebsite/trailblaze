// src/router.jsx
import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import PendingApproval from "./pages/PendingApproval/PendingApproval"

import Home from "./pages/Home/Home.jsx";
import About from "./pages/About/About.jsx";
import Map from "./pages/Map/Map.jsx";
import Place from "./pages/Place/Place.jsx";
import Places from "./pages/Categories/Categories.jsx";
import EditPlace from "./pages/editPlace/EditPlace.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AdminHome from "./pages/AdminHome/AdminHome.jsx";
import EditCategories from "./pages/editLocations/EditCategories.jsx";
import CategoryDetails from "./pages/CategoryDetail/CategoryDetails.jsx";
import ManageUser from "./pages/ManageUser/ManageUsers";
import RequireRole from "./components/RequireRole";
import ApplicantLayout from "./layouts/ApplicantLayout";

export const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            { path: "login", element: <Login />},
            { path: "register", element: <Register />},
        ],
    },
    {
        element: <ApplicantLayout />,
        children: [
            { path: "pending-approval", element: <PendingApproval />},
        ],
    },
    {
        element: <ProtectedLayout />,
        children: [
            { path: "/", element: <Home />},
            { path: "home", element: <Home />},
            { path: "about", element: <About /> },
            { path: "register", element: <Register />},
            { path: "place/:slug", element: <Place /> },
            { path: "places", element: <Places /> },
            { path: "map", element: <Map /> },
            { path: "categories/:slug", element: <CategoryDetails /> },
            { path: "*", element: <NotFoundPage /> },
            //Admin routes
            { path: "addPlace", element: (
                <RequireRole allowedRoles={["trailblazer", "ehren-member", "admin"]}>
                    <EditPlace />
                </RequireRole>
                ),
            },
            { path: "adminHome", element: (
                <RequireRole allowedRoles={["trailblazer", "ehren-member", "admin"]}>
                    <AdminHome />
                </RequireRole>
                ),
            },
            { path: "editCategories", element: (
                <RequireRole allowedRoles={["trailblazer", "ehren-member", "admin"]}>
                    <EditCategories />
                </RequireRole>
                ),
            },
            { path: "manageUser", element: (
                <RequireRole allowedRoles={["admin"]}>
                    <ManageUser />
                </RequireRole>
                ),
            },
        ],
    },
]);
