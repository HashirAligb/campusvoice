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
   status: "open" | "in_progress" | "resolved" | "closed";
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
   user_vote?: "upvote" | "downvote" | null;
}

interface FeedProps {
   selectedSchools: string[];
   selectedCategories: string[];
   refreshTrigger?: number;
   authorId?: string | null;
   searchQuery?: string | null;
}

export default function Feed({
   selectedSchools,
   selectedCategories,
   refreshTrigger,
   authorId,
   searchQuery = null,
}: FeedProps) {
   const [issues, setIssues] = useState<Issue[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const navigate = useNavigate();
   const normalizedSearch = searchQuery ?? null;

   const fetchIssues = async () => {
      setLoading(true);
      setError(null);

      try {
         // Try a simpler query first to check if table exists
         let query = supabase.from("issues").select("*");

         // Default ordering by time when no search filter
         if (!normalizedSearch) {
            query = query.order("created_at", { ascending: false });
         }

         // Apply filters
         if (selectedSchools.length > 0) {
            query = query.in("school", selectedSchools);
         }
         if (selectedCategories.length > 0) {
            query = query.in("category", selectedCategories);
         }
         if (authorId) {
            query = query.eq("author_id", authorId);
         }
         if (normalizedSearch) {
            query = query.ilike("title", `%${normalizedSearch}%`);
         }

         const { data, error: fetchError } = await query;

         if (fetchError) {
            // Check if it's a "relation does not exist" error
            if (
               fetchError.message?.includes("does not exist") ||
               fetchError.code === "PGRST116"
            ) {
               setError(
                  "Database tables not set up yet. Please run the SQL schema in Supabase."
               );
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
               const authorIds = [
                  ...new Set(data.map((issue: any) => issue.author_id)),
               ];
               const { data: profiles } = await supabase
                  .from("profiles")
                  .select("id, username, firstname, lastname")
                  .in("id", authorIds);

               if (profiles) {
                  const profilesMap = new Map(
                     profiles.map((p: any) => [p.id, p])
                  );
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
         const {
            data: { user },
         } = await supabase.auth.getUser();
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

               setIssues(
                  applyRelevanceOrdering(issuesWithVotes, normalizedSearch)
               );
            } catch (voteError) {
               // If vote fetch fails, just use issues without votes
               console.warn("Could not fetch votes:", voteError);
               setIssues(
                  applyRelevanceOrdering(issuesWithAuthors, normalizedSearch)
               );
            }
         } else {
            setIssues(
               applyRelevanceOrdering(issuesWithAuthors, normalizedSearch)
            );
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
   }, [
      selectedSchools,
      selectedCategories,
      refreshTrigger,
      authorId,
      normalizedSearch,
   ]);

   const applyRelevanceOrdering = (
      issuesList: Issue[],
      query: string | null
   ) => {
      if (!query) {
         return issuesList;
      }

      const q = query.trim().toLowerCase();
      if (!q) {
         return issuesList;
      }

      const scored = issuesList.map((issue) => {
         const title = (issue.title || "").toLowerCase();
         const desc = (issue.description || "").toLowerCase();

         const startsWithScore = title.startsWith(q) ? 5 : 0;
         const exactScore = title === q ? 8 : 0;
         const titleIncludes = title.includes(q) ? 3 : 0;
         const descIncludes = desc.includes(q) ? 1 : 0;

         const score =
            exactScore + startsWithScore + titleIncludes + descIncludes;
         return { ...issue, _score: score };
      });

      return scored
         .sort((a, b) => {
            if (b._score !== a._score) return b._score - a._score;
            return (
               new Date(b.created_at).getTime() -
               new Date(a.created_at).getTime()
            );
         })
         .map(({ _score, ...issue }) => issue as Issue);
   };

   const handleDelete = async (issue_id: string) => {
      try {
         // deletes issue
         const { error: fetchError } = await supabase
            .from("issues")
            .delete()
            .eq("id", issue_id);

         if (fetchError) throw fetchError;

         setIssues((prevIssues) =>
            prevIssues.filter((issue) => issue.id !== issue_id)
         );
      } catch (error) {
         console.log("error deleting post", error);

         // simple alert (could change to custom)
         alert("Failed to delete Issue");
      }
   };

   if (loading) {
      return (
         <div className='flex items-center justify-center py-12'>
            <div className='text-gray-400'>Loading issues...</div>
         </div>
      );
   }

   if (error) {
      return (
         <div className='bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-4 text-red-300'>
            <p>Error: {error}</p>
            <button
               onClick={fetchIssues}
               className='mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
            >
               Retry
            </button>
         </div>
      );
   }

   if (issues.length === 0) {
      const emptyMessage = authorId
         ? "You haven't posted any issues yet."
         : selectedSchools.length > 0 || selectedCategories.length > 0
         ? "No issues found matching your filters."
         : "No issues yet. Be the first to report one!";

      return (
         <div className='bg-gray-700 p-6 rounded-lg border border-gray-600 text-center'>
            <p className='text-gray-400'>{emptyMessage}</p>
         </div>
      );
   }

   return (
      <div className='space-y-4'>
         {issues.map((issue) => (
            <PostCard
               key={issue.id}
               issue={issue}
               onSelect={() => navigate(`/issues/${issue.id}`)}
               onDelete={handleDelete}
            />
         ))}
      </div>
   );
}
