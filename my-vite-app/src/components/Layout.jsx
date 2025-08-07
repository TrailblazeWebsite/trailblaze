import React from "react";
import "../styles/App.css"; // damit die container-Klasse verfügbar ist

const Layout = ({ children }) => {
    return <div className="container">{children}</div>;
};

export default Layout;
