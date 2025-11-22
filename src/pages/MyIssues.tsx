import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Feed from "@/components/Home/Feed";
import BackToFeedButton from "@/components/BackToFeedButton";
import { useAuth } from "@/auth/useAuth";

export default function MyIssues() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0d1017] text-white">
                <Navbar />
                <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-400">
                    Checking your session...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="relative min-h-screen text-white">
                <div className="fixed inset-0 -z-10 w-full [background:radial-gradient(125%_125%_at_50%_10%,#0d1017_60%,#4b5563_100%)]" />
                <Navbar />
                <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
                    <h1 className="text-3xl font-semibold">My Issues</h1>
                    <p className="text-gray-400">
                        Log in to see the issues you&rsquo;ve reported and track their status.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            className="btn-border-reveal px-4 py-2 rounded-md"
                            onClick={() => navigate("/Login")}
                        >
                            Go to Login
                        </button>
                        <BackToFeedButton className="px-4 py-2 rounded-md border border-gray-600 text-gray-200 hover:bg-gray-800 transition-colors" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen text-white">
            <div className="fixed inset-0 -z-10 w-full silver-gradient" />
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
                <BackToFeedButton />
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-wide text-gray-400">
                            Personal dashboard
                        </p>
                        <h1 className="text-3xl font-semibold">My Issues</h1>
                        <p className="text-gray-400">
                            Review the reports you've submitted and update their status.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="btn-border-reveal px-4 py-2 rounded-md"
                            onClick={() => setRefreshTrigger((prev) => prev + 1)}
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                <Feed
                    selectedSchools={[]}
                    selectedCategories={[]}
                    refreshTrigger={refreshTrigger}
                    authorId={user.id}
                />
            </div>
        </div>
    );
}
