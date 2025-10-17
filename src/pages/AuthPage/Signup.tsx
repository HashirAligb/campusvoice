import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function Signup() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 items-center justify-center bg-gray-900 text-white">

                <div className="w-full max-w-lg p-8 bg-gray-800 rounded-2xl text-center">
                    <h1 className="text-3xl font-semibold tracking-tight
                    bg-gradient-to-r from-green-500 via-green-400 to-green-200 bg-clip-text text-transparent">
                        Sign Up
                    </h1>
                    <form className="mt-6 mb-2 space-y-4 text-left">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block mb-1">First Name</label>
                                <input id="firstName" type="text" placeholder="John"
                                className="w-full px-3 py-2 rounded-lg border border-gray-400" />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block mb-1">Last Name</label>
                                <input id="lastName" type="text" placeholder="Doe"
                                className="w-full px-3 py-2 rounded-lg border border-gray-400" />
                            </div>
                        </div>
                        
                        <label htmlFor="email" className="block mb-1">Email Address</label>
                        <input id="email" type="email" placeholder="abc123@gmail.com"
                        className="w-full px-3 py-2 rounded-lg border border-gray-400" />

                        <label htmlFor="password" className="block mb-1">Password</label>
                        <input id="password" type="password" placeholder="••••••"
                        className="w-full px-3 py-2 rounded-lg border border-gray-400" />

                        <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
                        <input id="confirmPassword" type="password" placeholder="••••••"
                        className="w-full px-3 py-2 rounded-lg border border-gray-400" />
                    </form>
                    <button className="w-full px-3 py-2 mt-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-100">Submit</button>
                    <p className="mt-6 text-sm text-gray-400">
                        Already have an account? <Link to="/Login" className="text-green-400 hover:underline">Login</Link>
                    </p>
                </div>
                
            </div>
        </div>
    )
}