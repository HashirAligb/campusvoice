import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar.tsx";
import { useAuth } from "@/auth/useAuth"

export default function Landing() {
    const navigate = useNavigate();
    const {isAuthenticated: isLoggedIn} = useAuth();
    
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center bg-[url('/bg2.png')] bg-cover bg-center">
                <div className="translate-y-[-45px] text-center">
                    <h1 className="font-serif
                        text-8xl font-bold tracking-tight bg-gradient-to-r
                        from-green-500 via-green-400 to-green-200 bg-clip-text text-transparent">
                        CampusVoice
                    </h1>
                    <p className="
                        mt-1 text-xl font-semibold text-white tracking-tight">
                        Your Campus, Your Voice
                    </p>
                    <p className="
                        mt-4 text-2xl font-semibold text-white max-w-4xl">
                        A community-driven platform where students can raise issues, share feedback, and work together to improve campus life.
                    </p>
                    <div className="flex text-center justify-center space-x-4">
                        <button onClick={() => { if (!isLoggedIn) { navigate("/Login") } else navigate("/Home") }}
                            className="mt-4 px-5 py-2 bg-green-500 text-white text-xl font-semibold rounded-lg shadow-xl
                            hover:bg-green-700 hover:scale-105 transform transition duration-300">
                            Browse Issues
                        </button>
                        <button onClick={() => { if (!isLoggedIn) { navigate("/Login") } else navigate("/PostCard") }}
                            className="mt-4 px-5 py-2 bg-green-500 text-white text-xl font-semibold rounded-lg shadow-xl
                            hover:bg-green-700 hover:scale-105 transform transition duration-300">
                            Report an Issue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}