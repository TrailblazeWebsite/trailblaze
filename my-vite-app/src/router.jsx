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
import Login from "./pages/Login";
import Register from "./pages/Register";

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
            { path: "addPlace", element: <EditPlace /> },
            { path: "adminHome", element: <AdminHome /> },
            { path: "editCategories", element: <EditCategories /> },
            { path: "categories/:id", element: <CategoryDetails /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
