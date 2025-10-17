import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useAuth() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

        const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
            setUser(session?.user ?? null);
        });

        return () => sub.subscription.unsubscribe();
    }, []);

    const signOut = useCallback(() => supabase.auth.signOut(), []);

    return { user, isAuthenticated: !!user, signOut };
}