import React from "react";
import AuthControls from "./AuthControls";
import { useAuth } from "@/auth/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Searchbar from "./Searchbar";

export default function Navbar() {
    const navigate = useNavigate();
    const { signOut, isAuthenticated } = useAuth();
    const isHome = location.pathname === "/Home";


    return (
        <div className="bg-[#12161f] h-19 border-b border-gray-500">
            <div className="flex items-center justify-between h-full w-full px-6">
                <Link to="/" className="font-serif text-3xl font-bold
                    bg-gradient-to-r from-green-500 via-green-400 to-green-200 bg-clip-text text-transparent">
                    CampusVoice
                </Link>
                {isHome && <Searchbar />}             
                <AuthControls
                    loggedIn={ isAuthenticated }
                    onLoginClick={() => navigate("/Login")}
                    onSignupClick={() => navigate("/Signup")}
                    onLogoutClick={() => { signOut(); navigate("/"); }}
                />
            </div>
        </div>
    )
}