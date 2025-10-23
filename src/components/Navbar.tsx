import AuthControls from "./AuthControls";
import { useAuth } from "@/auth/useAuth";
import { use } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const { signOut, isAuthenticated } = useAuth();

    return (
        <div className="bg-gray-900 h-19 border-b border-gray-500">
            <div className="flex items-center justify-between h-full w-full px-6">
                <Link to="/" className="font-serif text-3xl font-bold
                    bg-gradient-to-r from-green-500 via-green-400 to-green-200 bg-clip-text text-transparent">
                    CampusVoice
                </Link>
                <AuthControls
                    loggedIn={ isAuthenticated }
                    onLoginClick={() => navigate("/Login")}
                    onSignupClick={() => navigate("/Signup")}
                    onLogoutClick={() => { signOut(); navigate("/"); }} />
            </div>
        </div>
    )
}