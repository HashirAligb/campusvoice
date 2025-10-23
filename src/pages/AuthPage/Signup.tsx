import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const navigate = useNavigate();

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setInfo(null);

        if (password !== confirmPassword) return setError("Passwords do not match.");

        const { count, error: checkErr } = await supabase.from('profiles').select('*', {count: 'exact', head: true}).ilike('username', userName.trim());

        if (checkErr) {
            setError(checkErr.message);
            return;
        }
        if ((count ?? 0) > 0) {
            setError("Username already taken")
            return
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { firstName, lastName, userName },
                emailRedirectTo: `${window.location.origin}/`,
            },
        });

        if (signUpError) {
            setError(signUpError.message)
            return
        }

        const identities = data?.user?.identities ?? [];
        if (identities.length === 0) {
            setError("Email address is already taken.");
            return;
        }

        setInfo("✅ Please check your email to complete sign-up.")
        return
    }

    useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN" && !info) {
            navigate("/");
        }
    });
    return () => sub.subscription.unsubscribe();
    }, [navigate, info]);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 items-center justify-center bg-gray-900 text-white">

                <div className="w-full max-w-lg p-7 bg-gray-800 rounded-lg text-center border border-gray-400">
                    <h1 className="text-3xl font-semibold tracking-tight
                    bg-gradient-to-r from-green-500 via-green-400 to-green-200 bg-clip-text text-transparent">
                        Sign Up
                    </h1>
                    <form onSubmit={handleSignup} className="mt-6 mb-2 space-y-4 text-left">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block mb-1">First Name</label>
                                <input id="firstName" type="text" placeholder="John" value={firstName} required onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-400" />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block mb-1">Last Name</label>
                                <input id="lastName" type="text" placeholder="Pork" value={lastName} required onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-400" />
                            </div>
                        </div>

                        <label htmlFor="username" className="block mb-1">Username</label>
                        <input id="username" type="text" placeholder="porko67" value={userName} onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-400" />
                        
                        <label htmlFor="email" className="block mb-1">Email Address</label>
                        <input id="email" type="email" placeholder="abc123@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-400" />

                        <label htmlFor="password" className="block mb-1">Password</label>
                        <input id="password" type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-400" />

                        <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
                        <input id="confirmPassword" type="password" placeholder="••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-400" />

                        <button type="submit" className="w-full px-3 py-2 mt-4 bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-100">
                            Submit
                        </button>
                    </form>
                    {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                    {info && <p className="mt-3 text-sm text-green-500">{info}</p>}
                    <p className="mt-7 text-sm text-gray-400">
                        Already have an account? <Link to="/Login" className="text-green-400 hover:underline">Login</Link>
                    </p>
                </div>

            </div>
        </div>
    )
}