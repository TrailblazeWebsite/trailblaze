import React, {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import "./styles/Global.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <div className="app-wrapper">
            <RouterProvider router={router} />
        </div>
    </StrictMode>
);
