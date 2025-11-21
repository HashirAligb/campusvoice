import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import PostCard from "../PostCard";

interface Issue {
    id: string;
    title: string;
    description: string;
    school: string;
    category: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    image_url: string | null;
    upvotes: number;
    downvotes: number;
    created_at: string;
    updated_at: string;
    author_id: string;
    author?: {
        id: string;
        username: string | null;
        firstname: string | null;
        lastname: string | null;
    };
    user_vote?: 'upvote' | 'downvote' | null;
}

interface FeedProps {
    selectedSchool: string | null;
    selectedCategory: string | null;
    refreshTrigger?: number;
}

export default function Feed({ selectedSchool, selectedCategory, refreshTrigger }: FeedProps) {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchIssues = async () => {
        setLoading(true);
        setError(null);

        try {
            // Try a simpler query first to check if table exists
            let query = supabase
                .from("issues")
                .select("*")
                .order("created_at", { ascending: false });

            // Apply filters
            if (selectedSchool) {
                query = query.eq("school", selectedSchool);
            }
            if (selectedCategory) {
                query = query.eq("category", selectedCategory);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) {
                // Check if it's a "relation does not exist" error
                if (fetchError.message?.includes("does not exist") || fetchError.code === "PGRST116") {
                    setError("Database tables not set up yet. Please run the SQL schema in Supabase.");
                    setLoading(false);
                    return;
                }
                throw fetchError;
            }

            // If we have data, try to get author info (optional, won't break if it fails)
            let issuesWithAuthors = data || [];
            if (data && data.length > 0) {
                try {
                    // Try to get author info, but don't fail if it doesn't work
                    const authorIds = [...new Set(data.map((issue: any) => issue.author_id))];
                    const { data: profiles } = await supabase
                        .from("profiles")
                        .select("id, username, firstname, lastname")
                        .in("id", authorIds);

                    if (profiles) {
                        const profilesMap = new Map(profiles.map((p: any) => [p.id, p]));
                        issuesWithAuthors = data.map((issue: any) => ({
                            ...issue,
                            author: profilesMap.get(issue.author_id) || null,
                        }));
                    }
                } catch (authorError) {
                    // If author fetch fails, just use data without author info
                    console.warn("Could not fetch author info:", authorError);
                    issuesWithAuthors = data;
                }
            }

            // Get current user's votes
            const { data: { user } } = await supabase.auth.getUser();
            if (user && issuesWithAuthors.length > 0) {
                try {
                    const issueIds = issuesWithAuthors.map((issue: any) => issue.id);
                    const { data: votes } = await supabase
                        .from("issue_votes")
                        .select("issue_id, vote_type")
                        .eq("user_id", user.id)
                        .in("issue_id", issueIds);

                    // Map votes to issues
                    const votesMap = new Map(
                        votes?.map((v: any) => [v.issue_id, v.vote_type]) || []
                    );

                    const issuesWithVotes = issuesWithAuthors.map((issue: any) => ({
                        ...issue,
                        user_vote: votesMap.get(issue.id) || null,
                    }));

                    setIssues(issuesWithVotes as Issue[]);
                } catch (voteError) {
                    // If vote fetch fails, just use issues without votes
                    console.warn("Could not fetch votes:", voteError);
                    setIssues(issuesWithAuthors as Issue[]);
                }
            } else {
                setIssues(issuesWithAuthors as Issue[]);
            }
        } catch (err: any) {
            setError(err.message || "Failed to load issues");
            console.error("Error fetching issues:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, [selectedSchool, selectedCategory, refreshTrigger]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading issues...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-4 text-red-300">
                <p>Error: {error}</p>
                <button
                    onClick={fetchIssues}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (issues.length === 0) {
        return (
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 text-center">
                <p className="text-gray-400">
                    {selectedSchool || selectedCategory
                        ? "No issues found matching your filters."
                        : "No issues yet. Be the first to report one!"}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {issues.map((issue) => (
                <PostCard
                    key={issue.id}
                    issue={issue}
                    onSelect={() => navigate(`/issues/${issue.id}`)}
                />
            ))}
        </div>
    );
}

