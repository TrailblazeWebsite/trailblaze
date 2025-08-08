import React, { useState } from 'react';
import {supabase} from "../../Backend/supabaseClient";
import {Link, useNavigate} from "react-router-dom";
import styles from "./Register.module.css";

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            setMessage(error.message);
            return;
        }
        if (data) {
            setMessage("User account created!")
            navigate("/login")
        }
        setEmail("");
        setPassword("");
    };

    return (
        <div className={styles.wrapper}>
            <img src={"https://res.cloudinary.com/dgfycfxe1/image/upload/v1754420389/trailblaze_red_logo2_xlecjf.png"} alt="Logo" className={styles["responsive-img"]}/>
            <h1>Register</h1>
            <br></br>
            {message && <span>{message}</span>}
            <form onSubmit={handleSubmit} className={styles["form"]}>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Email"
                    required
                />
                <br/>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Password"
                    required
                />
                <br/>
                <button type="submit">Create Account</button>
            </form>
            <span>Already have an Account?</span>
            <br/>
            <Link to="/login">Login</Link>
        </div>
    );
}

export default Register;