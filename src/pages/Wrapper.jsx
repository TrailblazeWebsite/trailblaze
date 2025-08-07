import React, {useEffect, useState} from "react";
import {supabase} from "../Backend/supabaseClient";
import { Navigate} from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";


function Wrapper ({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const {
                data: {session}
            } = await supabase.auth.getSession();
            setAuthenticated(!!session);
            setLoading(false);
        };

        getSession();
    }, []);
    if (loading) {
        return <div>Loading</div>
    } else {
        if (authenticated) {
            return (
                <>
                    <Navbar />
                    <div className={"main-content"}>
                        {children}
                    </div>
                </>
            );
        }
        return <Navigate to="/login" />
    }
}

export default Wrapper;