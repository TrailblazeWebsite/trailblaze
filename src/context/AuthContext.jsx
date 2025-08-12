// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../Backend/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // merged user + profile
    const [loading, setLoading] = useState(true);

    // Load user + profile from Supabase
    const loadUserAndProfile = async () => {
        console.log("[AuthContext] Loading user & profile...");
        setLoading(true);

        try {
            // 1️⃣ Get session first
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;

            const session = sessionData?.session;
            if (!session) {
                console.log("[AuthContext] No active session found.");
                setUser(null);
                return;
            }

            // 2️⃣ Get authenticated user
            const { data: userData, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;

            const authUser = userData?.user;
            if (!authUser) {
                console.log("[AuthContext] No authenticated user found.");
                setUser(null);
                return;
            }

            // 3️⃣ Get profile from DB
            let { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", authUser.id)
                .maybeSingle(); // ✅ won't throw if missing

            if (profileError && profileError.code !== "PGRST116") {
                throw profileError;
            }

            // 4️⃣ If profile missing, create it
            if (!profileData) {
                console.log("[AuthContext] No profile found — creating one...");
                const { data: newProfile, error: insertError } = await supabase
                    .from("profiles")
                    .insert([{ id: authUser.id, email: authUser.email }])
                    .select()
                    .single();

                if (insertError) throw insertError;
                profileData = newProfile;
            }

            console.log("[AuthContext] Loaded profile:", profileData);

            // 5️⃣ Merge user + profile
            const mergedUser = { ...authUser, ...profileData };
            setUser(mergedUser);
        } catch (err) {
            console.error("[AuthContext] Auth error:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let ignore = false;

        loadUserAndProfile();

        // Listen for auth state changes
        const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
            console.log("[AuthContext] Auth state changed:", event);
            if (!ignore) loadUserAndProfile();
        });

        return () => {
            ignore = true;
            subscription?.subscription?.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile: user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
