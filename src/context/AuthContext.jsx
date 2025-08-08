import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../Backend/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setUser(null);
            setProfile(null);
            setLoading(false);
            return;
        }

        const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        setUser(user);
        setProfile(profileData);
        setLoading(false);
    };

    useEffect(() => {
        loadUser();
        const { data: listener } = supabase.auth.onAuthStateChange(() => {
            loadUser();
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
