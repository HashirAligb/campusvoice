import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (signInError) {
            setError(signInError.message);
            return;
        } navigate("/Home")
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 items-center justify-center bg-gray-900 text-white">

                <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg text-center border border-gray-400">
                    <h1 className="text-3xl font-semibold tracking-tight
                    bg-gradient-to-r from-green-500 via-green-400 to-green-200 bg-clip-text text-transparent">
                        Log In
                    </h1>
                    <form className="mt-6 mb-2 space-y-4 text-left" onSubmit={handleLogin}>
                        <label htmlFor="email" className="block mb-1">Email Address</label>
                        <input id="email" type="email" placeholder="abc123@gmail.com" onChange={ (e) => setEmail(e.target.value)} required
                        className="w-full px-3 py-2 rounded-lg border border-gray-400" />

                        <label htmlFor="password" className="block mb-1">Password</label>
                        <input id="password" type="password" placeholder="••••••" onChange={ (e) => setPassword(e.target.value)} required
                        className="w-full px-3 py-2 rounded-lg border border-gray-400" />

                        <button type="submit" disabled={loading} className="w-full px-3 py-2 mt-4 bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-100">{loading ? "Logging in...": "Log In"}</button>
                    </form>
                    {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                    <p className="mt-7 text-sm text-gray-400">
                        Don't have an account? <Link to="/Signup" className="text-green-400 hover:underline">Sign up</Link>
                    </p>
                </div>
                
            </div>
        </div>
    )
}