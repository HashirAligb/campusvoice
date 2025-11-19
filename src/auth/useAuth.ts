import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user ?? null);
            setIsLoading(false);
        })

        const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
            setUser(session?.user ?? null);
        });

        return () => sub.subscription.unsubscribe();
    }, []);
    // returns supabase's sign out function so it can be used in Navbar or anywhere else
    const signOut = useCallback(() => supabase.auth.signOut(), []);
    return { user, isAuthenticated: !!user, isLoading, signOut };
}