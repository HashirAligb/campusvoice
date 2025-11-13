import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/auth/useAuth";

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
        first_name: string | null;
        last_name: string | null;
    };
    user_vote?: 'upvote' | 'downvote' | null;
}

interface PostCardProps {
    issue: Issue;
    onUpdate: () => void;
}

export default function PostCard({ issue, onUpdate }: PostCardProps) {
    const { user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [localUpvotes, setLocalUpvotes] = useState(issue.upvotes);
    const [localDownvotes, setLocalDownvotes] = useState(issue.downvotes);
    const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(issue.user_vote || null);

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open":
                return "bg-green-600";
            case "in_progress":
                return "bg-yellow-600";
            case "resolved":
                return "bg-blue-600";
            case "closed":
                return "bg-gray-600";
            default:
                return "bg-gray-600";
        }
    };

    const handleVote = async (voteType: 'upvote' | 'downvote') => {
        if (!user || isVoting) return;

        const newVote = userVote === voteType ? null : voteType;
        setIsVoting(true);

        try {
            // Remove existing vote if any
            if (userVote) {
                await supabase
                    .from("issue_votes")
                    .delete()
                    .eq("issue_id", issue.id)
                    .eq("user_id", user.id);
            }

            // Add new vote if not removing
            if (newVote) {
                await supabase
                    .from("issue_votes")
                    .insert({
                        issue_id: issue.id,
                        user_id: user.id,
                        vote_type: newVote,
                    });
            }

            // Update local state optimistically
            if (userVote === 'upvote') {
                setLocalUpvotes(prev => prev - 1);
            } else if (userVote === 'downvote') {
                setLocalDownvotes(prev => prev - 1);
            }

            if (newVote === 'upvote') {
                setLocalUpvotes(prev => prev + 1);
            } else if (newVote === 'downvote') {
                setLocalDownvotes(prev => prev + 1);
            }

            setUserVote(newVote);
            onUpdate(); // Refresh to get accurate counts
        } catch (error) {
            console.error("Error voting:", error);
        } finally {
            setIsVoting(false);
        }
    };

    const descriptionPreview = issue.description.length > 200 
        ? issue.description.substring(0, 200) + "..."
        : issue.description;

    return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden hover:border-gray-500 transition-colors">
            <div className="flex">
                {/* Voting Section */}
                <div className="flex flex-col items-center p-2 bg-gray-900 w-12">
                    <button
                        onClick={() => handleVote('upvote')}
                        disabled={!user || isVoting}
                        className={`p-1 rounded transition-colors ${
                            userVote === 'upvote'
                                ? "text-green-500 hover:text-green-400"
                                : "text-gray-400 hover:text-green-400"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <span className="text-sm font-semibold text-gray-300 py-1">
                        {localUpvotes - localDownvotes}
                    </span>
                    <button
                        onClick={() => handleVote('downvote')}
                        disabled={!user || isVoting}
                        className={`p-1 rounded transition-colors ${
                            userVote === 'downvote'
                                ? "text-red-500 hover:text-red-400"
                                : "text-gray-400 hover:text-red-400"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-white">{issue.title}</h3>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(issue.status)} text-white`}>
                                    {issue.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <span>{issue.school}</span>
                                <span>•</span>
                                <span>{issue.category}</span>
                                <span>•</span>
                                <span>{formatTimeAgo(issue.created_at)}</span>
                                {issue.author && (
                                    <>
                                        <span>•</span>
                                        <span>
                                            {issue.author.username || 
                                             `${issue.author.first_name || ''} ${issue.author.last_name || ''}`.trim() || 
                                             'Anonymous'}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-300 mb-3">
                        {isExpanded ? issue.description : descriptionPreview}
                    </p>

                    {issue.description.length > 200 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-sm text-green-400 hover:text-green-300 mb-3"
                        >
                            {isExpanded ? "Show less" : "Show more"}
                        </button>
                    )}

                    {issue.image_url && (
                        <div className="mt-3">
                            <img
                                src={issue.image_url}
                                alt={issue.title}
                                className="max-w-full h-auto rounded-md border border-gray-600"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
