import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../Backend/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (!user || userError) {
            setUser(null);
            setProfile(null);
            setLoading(false);
            return;
        }

        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError) {
            console.error("Failed to fetch profile:", profileError);
            setProfile(null);
        } else {
            console.log("Loaded profile:", profileData);
            setProfile(profileData);
        }

        setUser(user);
        setLoading(false);
    };


    useEffect(() => {
        loadUser();

        const { data } = supabase.auth.onAuthStateChange(() => {
            loadUser();
        });

        return () => {
            if (data?.subscription?.unsubscribe) {
                data.subscription.unsubscribe();
            }
        }
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
