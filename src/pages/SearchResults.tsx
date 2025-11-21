import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Feed from "@/components/Home/Feed";
import BackToFeedButton from "@/components/BackToFeedButton";

export default function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();

    const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const query = params.get("query") ?? "";

    return (
        <div className="min-h-screen bg-[#0d1017] text-white">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
                <BackToFeedButton className="mb-2" />
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="uppercase tracking-wide text-xs text-gray-500">Search</p>
                        <h1 className="text-3xl font-semibold">
                            Results for&nbsp;
                            <span className="text-green-400">
                                {query ? `"${query}"` : "all issues"}
                            </span>
                        </h1>
                    </div>
                    <button
                        className="btn-border-reveal px-4 py-2 rounded-md"
                        onClick={() => navigate("/Home")}
                    >
                        Home
                    </button>
                </div>

                <Feed
                    selectedSchool={null}
                    selectedCategory={null}
                    searchQuery={query || null}
                />
            </div>
        </div>
    );
}
