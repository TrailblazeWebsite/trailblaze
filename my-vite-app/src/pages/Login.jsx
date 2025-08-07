import React, { useState } from 'react';
import {supabase} from "../Backend/supabaseClient";
import {Link, useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setMessage(error.message);
            setEmail("");
            setPassword("");
            return;
        }
        if (data) {
            navigate("/")
            return null;
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <br></br>
            {message && <span>{message}</span>}
            <form onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Email"
                    required
                />
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Password"
                    required
                />
                <button type="submit">Log in</button>
            </form>
            <span>Don't have an account?</span>
            <br/>
            <Link to="/register">Register</Link>
        </div>

    );
}

export default Login;