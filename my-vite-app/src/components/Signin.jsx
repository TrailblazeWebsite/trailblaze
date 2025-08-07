import React from "react";
import "../styles/App.css"; // damit die container-Klasse verfügbar ist

const SignIn = ({ children }) => {
    return <div className="container">{children}</div>;
};

export default SignIn;