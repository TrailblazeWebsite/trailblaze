// src/router.jsx
import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

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
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ManageUser from "./pages/ManageUser/ManageUsers";
import RequireAdmin from "./components/RequireAdmin";

export const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            { path: "login", element: <Login />},
            { path: "register", element: <Register />},
        ],
    },
    {
        element: <ProtectedLayout />,
        children: [
            { path: "/", element: <Home />},
            { path: "home", element: <Home />},
            { path: "about", element: <About /> },
            { path: "register", element: <Register />},
            { path: "place/:id", element: <Place /> },
            { path: "places", element: <Places /> },
            { path: "map", element: <Map /> },
            { path: "categories/:id", element: <CategoryDetails /> },
            { path: "*", element: <NotFoundPage /> },
            //Admin routes
            { path: "addPlace", element: (
                <RequireAdmin>
                    <EditPlace />
                </RequireAdmin>
                ),
            },
            { path: "adminHome", element: (
                <RequireAdmin>
                    <AdminHome />
                </RequireAdmin>
                ),
            },
            { path: "editCategories", element: (
                <RequireAdmin>
                    <EditCategories />
                </RequireAdmin>

                ),
            },
            { path: "manageUser", element: (
                <RequireAdmin>
                    <ManageUser />
                </RequireAdmin>
                ),
            },
        ],
    },
]);
