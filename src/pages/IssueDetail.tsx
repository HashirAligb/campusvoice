import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/auth/useAuth";
import type { Status } from "@/components/ChangeStatus";
import ChangeStatus from "@/components/ChangeStatus";
import BackToFeedButton from "@/components/BackToFeedButton";
import DeleteButton from "@/components/DeleteButton";

type Issue = {
   id: string;
   title: string;
   description: string;
   school: string;
   category: string;
   status: Status;
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
   } | null;
};

type Comment = {
   id: string;
   content: string;
   created_at: string;
   author_id: string | null;
   author?: {
      id: string;
      username: string | null;
      firstname: string | null;
      lastname: string | null;
   } | null;
};

export default function IssueDetail() {
   const { issueId } = useParams<{ issueId: string }>();
   const navigate = useNavigate();
   const { user } = useAuth();

   const [issue, setIssue] = useState<Issue | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [localUpvotes, setLocalUpvotes] = useState(0);
   const [localDownvotes, setLocalDownvotes] = useState(0);
   const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
   const [isVoting, setIsVoting] = useState(false);
   const [localStatus, setLocalStatus] = useState<Status>("open");

   const [comments, setComments] = useState<Comment[]>([]);
   const [commentsError, setCommentsError] = useState<string | null>(null);
   const [isCommentsLoading, setIsCommentsLoading] = useState(true);
   const [newComment, setNewComment] = useState("");
   const [isSubmittingComment, setIsSubmittingComment] = useState(false);
   const [commentHeight, setCommentHeight] = useState<string>("auto");
   const commentInputRef = useRef<HTMLTextAreaElement | null>(null);

   useEffect(() => {
      if (!issueId) return;

      const fetchIssue = async () => {
         setLoading(true);
         setError(null);
         try {
            const { data, error: fetchError } = await supabase
               .from("issues")
               .select("*")
               .eq("id", issueId)
               .single();

            if (fetchError) {
               throw fetchError;
            }

            let author = null;
            if (data?.author_id) {
               const { data: profiles } = await supabase
                  .from("profiles")
                  .select("id, username, firstname, lastname")
                  .eq("id", data.author_id)
                  .limit(1);
               author = profiles && profiles.length > 0 ? profiles[0] : null;
            }

            setIssue({ ...(data as Issue), author });
            setLocalUpvotes(data.upvotes);
            setLocalDownvotes(data.downvotes);
            setLocalStatus(data.status);

            if (user) {
               const { data: voteData } = await supabase
                  .from("issue_votes")
                  .select("vote_type")
                  .eq("issue_id", issueId)
                  .eq("user_id", user.id)
                  .limit(1);

               if (voteData && voteData.length > 0) {
                  setUserVote(voteData[0].vote_type as "upvote" | "downvote");
               } else {
                  setUserVote(null);
               }
            } else {
               setUserVote(null);
            }
         } catch (err: any) {
            console.error("Failed to load issue:", err);
            setError(err.message ?? "Unable to load issue.");
         } finally {
            setLoading(false);
         }
      };

      fetchIssue();
   }, [issueId, user]);

   const loadComments = useCallback(async () => {
      if (!issueId) return;
      setIsCommentsLoading(true);
      setCommentsError(null);
      try {
         const { data, error: commentsFetchError } = await supabase
            .from("issue_comments")
            .select("id, content, created_at, author_id")
            .eq("issue_id", issueId)
            .order("created_at", { ascending: true });

         if (commentsFetchError) {
            if (
               commentsFetchError.message?.includes("does not exist") ||
               commentsFetchError.code === "PGRST116"
            ) {
               setCommentsError(
                  "Comments are not available yet. Please set up the database table."
               );
               setComments([]);
               return;
            }
            throw commentsFetchError;
         }

         const rawComments = data || [];
         const authorIds = [
            ...new Set(
               rawComments.map((comment) => comment.author_id).filter(Boolean)
            ),
         ] as string[];

         let authorsMap = new Map();
         if (authorIds.length > 0) {
            const { data: profiles } = await supabase
               .from("profiles")
               .select("id, username, firstname, lastname")
               .in("id", authorIds);
            authorsMap = new Map(
               (profiles || []).map((profile) => [profile.id, profile])
            );
         }

         const commentsWithAuthors = rawComments.map((comment) => ({
            ...comment,
            author: authorsMap.get(comment.author_id) ?? null,
         }));

         setComments(commentsWithAuthors);
      } catch (err: any) {
         console.error("Failed to load comments:", err);
         setCommentsError(err.message ?? "Unable to load comments.");
      } finally {
         setIsCommentsLoading(false);
      }
   }, [issueId]);

   useEffect(() => {
      loadComments();
   }, [loadComments]);

   const formatTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400)
         return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800)
         return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return date.toLocaleDateString();
   };

   const issueMeta = useMemo(() => {
      if (!issue) return null;
      return [
         issue.school,
         issue.category,
         formatTimeAgo(issue.created_at),
         issue.author
            ? issue.author.username ||
              `${issue.author.firstname || ""} ${
                 issue.author.lastname || ""
              }`.trim()
            : "Anonymous",
      ];
   }, [issue]);

   const handleVote = async (voteType: "upvote" | "downvote") => {
      if (!user || !issue || isVoting) return;

      const newVote = userVote === voteType ? null : voteType;
      setIsVoting(true);

      try {
         if (userVote) {
            await supabase
               .from("issue_votes")
               .delete()
               .eq("issue_id", issue.id)
               .eq("user_id", user.id);
         }

         if (newVote) {
            await supabase.from("issue_votes").insert({
               issue_id: issue.id,
               user_id: user.id,
               vote_type: newVote,
            });
         }

         if (userVote === "upvote") {
            setLocalUpvotes((prev) => prev - 1);
         } else if (userVote === "downvote") {
            setLocalDownvotes((prev) => prev - 1);
         }

         if (newVote === "upvote") {
            setLocalUpvotes((prev) => prev + 1);
         } else if (newVote === "downvote") {
            setLocalDownvotes((prev) => prev + 1);
         }

         setUserVote(newVote);
      } catch (err) {
         console.error("Error voting:", err);
      } finally {
         setIsVoting(false);
      }
   };

   const handleSubmitComment = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!user) {
         setCommentsError("You must be logged in to comment.");
         return;
      }
      if (!issueId || !newComment.trim()) {
         return;
      }

      setIsSubmittingComment(true);
      setCommentsError(null);

      try {
         const { error: insertError } = await supabase
            .from("issue_comments")
            .insert({
               issue_id: issueId,
               author_id: user.id,
               content: newComment.trim(),
            });

         if (insertError) {
            throw insertError;
         }

         setNewComment("");
         setCommentHeight("auto");
         if (commentInputRef.current) {
            const el = commentInputRef.current;
            el.style.height = "auto";
         }
         await loadComments();
      } catch (err: any) {
         console.error("Failed to submit comment:", err);
         setCommentsError(
            err.message ??
               "Unable to submit your comment right now. Please try again later."
         );
      } finally {
         setIsSubmittingComment(false);
      }
   };

   const handleCommentInput = (
      event: React.ChangeEvent<HTMLTextAreaElement>
   ) => {
      setNewComment(event.target.value);
      const el = event.target;
      el.style.height = "auto";
      const nextHeight = `${el.scrollHeight}px`;
      el.style.height = nextHeight;
      setCommentHeight(nextHeight);
   };

   useEffect(() => {
      if (commentInputRef.current) {
         const el = commentInputRef.current;
         el.style.height = "auto";
         const nextHeight = `${el.scrollHeight}px`;
         el.style.height = nextHeight;
         setCommentHeight(nextHeight);
      }
   }, [newComment]);

   const handleStatusChange = (statusChange: Status) => {
      setLocalStatus(statusChange);
   };

   const handleDelete = async (issue_id: string) => {
      try {
         // deletes issue
         const { error: fetchError } = await supabase
            .from("issues")
            .delete()
            .eq("id", issue_id);

         if (fetchError) throw fetchError;

         // redirect back to the homepage to indicate deletion
         setTimeout(() => {
            navigate("/Home");
         }, 1500);
      } catch (error) {
         console.log("error deleting post", error);

         // simple alert (could change to custom)
         alert("Failed to delete Issue");
      }
   };

   if (loading) {
      return (
         <div className='min-h-screen bg-[#0d1017] text-white'>
            <Navbar />
            <div className='flex items-center justify-center py-20'>
               <p className='text-gray-400'>Loading issue...</p>
            </div>
         </div>
      );
   }

   if (error || !issue) {
      return (
         <div className='min-h-screen bg-[#0d1017] text-white'>
            <Navbar />
            <div className='max-w-3xl mx-auto py-20 px-4'>
               <p className='text-red-400 mb-4'>
                  {error || "Issue not found."}
               </p>
               <button
                  className='btn-border-reveal px-4 py-2 rounded-md'
                  onClick={() => navigate(-1)}
               >
                  Go Back
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className='min-h-screen silver-gradient text-white'>
         <Navbar />
         <div className='max-w-5xl mx-auto px-4 py-10'>
            <BackToFeedButton className='mb-6' />

            <div className='bg-transparent shadow-xl'>
               <div className='flex'>
                  <div className='flex flex-col items-center px-4 py-6'>
                     <button
                        onClick={() => handleVote("upvote")}
                        disabled={!user || isVoting}
                        className={`p-2 rounded hover:text-green-400 ${
                           userVote === "upvote"
                              ? "text-green-500"
                              : "text-gray-400"
                        } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                     >
                        ▲
                     </button>
                     <span className='font-semibold text-lg'>
                        {localUpvotes - localDownvotes}
                     </span>
                     <button
                        onClick={() => handleVote("downvote")}
                        disabled={!user || isVoting}
                        className={`p-2 rounded hover:text-red-400 ${
                           userVote === "downvote"
                              ? "text-red-500"
                              : "text-gray-400"
                        } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                     >
                        ▼
                     </button>
                  </div>
                  <div className='flex-1 p-3'>
                     <div className='relative flex flex-wrap items-center gap-3 mb-3'>
                        <h1 className='text-3xl font-semibold'>
                           {issue.title}
                        </h1>
                        <ChangeStatus
                           issue_id={issue.id}
                           current_status={localStatus}
                           author_id={issue.author_id}
                           onStatusChange={handleStatusChange}
                        />
                        {user?.id == issue.author_id ? (
                           <DeleteButton
                              issue_id={issue.id}
                              author_id={issue.author_id}
                              onDelete={handleDelete}
                           />
                        ) : null}
                     </div>
                     {issueMeta && (
                        <div className='text-sm text-gray-400 mb-4 flex flex-wrap gap-2'>
                           {issueMeta.map((item, index) => (
                              <span
                                 key={index}
                                 className='flex items-center gap-2'
                              >
                                 {item}
                                 {index !== issueMeta.length - 1 && (
                                    <span className='text-gray-600'>•</span>
                                 )}
                              </span>
                           ))}
                        </div>
                     )}
                     <p className='text-lg leading-relaxed text-gray-200 mb-3 whitespace-pre-line'>
                        {issue.description}
                     </p>

                     {issue.image_url && (
                        <img
                           src={issue.image_url}
                           alt={issue.title}
                           className='w-full rounded-lg border border-gray-700'
                        />
                     )}
                  </div>
               </div>
            </div>

            <section className='mt-5 space-y-6'>
               <div>
                  <h2 className='text-2xl font-semibold mb-3'>
                     Share your thoughts
                  </h2>
                  <form onSubmit={handleSubmitComment} className='space-y-3'>
                     <textarea
                        ref={commentInputRef}
                        value={newComment}
                        onChange={handleCommentInput}
                        placeholder={
                           user
                              ? "Share your thoughts..."
                              : "Log in to join the conversation."
                        }
                        className='w-full bg-[#12161f] border border-gray-700 rounded-lg p-3 text-white resize-none overflow-hidden focus:outline-none focus:border-green-500'
                        rows={1}
                        style={{ height: commentHeight }}
                        disabled={!user || isSubmittingComment}
                     />
                     <div className='flex justify-end'>
                        <button
                           type='submit'
                           disabled={
                              !user || isSubmittingComment || !newComment.trim()
                           }
                           className='px-4 py-2 bg-green-600 rounded-md hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer'
                        >
                           {isSubmittingComment ? "Posting..." : "Post Comment"}
                        </button>
                     </div>
                  </form>
               </div>

               <div>
                  <div className='flex items-center gap-2 mb-4'>
                     <h3 className='text-xl font-semibold'>Comments</h3>
                     {!isCommentsLoading && (
                        <span className='text-sm text-gray-400'>
                           {comments.length}{" "}
                           {comments.length === 1 ? "comment" : "comments"}
                        </span>
                     )}
                  </div>
                  {isCommentsLoading ? (
                     <p className='text-gray-400'>Loading comments...</p>
                  ) : commentsError ? (
                     <p className='text-red-400'>{commentsError}</p>
                  ) : comments.length === 0 ? (
                     <p className='text-gray-400'>
                        No comments yet. Be the first to add one!
                     </p>
                  ) : (
                     <div className='space-y-4'>
                        {comments.map((comment) => (
                           <div
                              key={comment.id}
                              className='bg-[#12161f] border border-gray-700 p-4 rounded-lg'
                           >
                              <div className='flex items-center gap-2 text-sm text-gray-400 mb-2'>
                                 <span>
                                    {comment.author
                                       ? comment.author.username ||
                                         `${comment.author.firstname || ""} ${
                                            comment.author.lastname || ""
                                         }`.trim()
                                       : "Anonymous"}
                                 </span>
                                 <span>•</span>
                                 <span>
                                    {formatTimeAgo(comment.created_at)}
                                 </span>
                              </div>
                              <p className='text-gray-200 whitespace-pre-line'>
                                 {comment.content}
                              </p>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </section>
         </div>
      </div>
   );
}
