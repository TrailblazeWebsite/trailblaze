import { useEffect, useState } from "react";
import { supabase} from "./supabaseClient";

export default function useUserWithRole() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            setUserData({ ...user, role: profile?.role });
        };

        getUser();
    }, []);

    return userData;
}
