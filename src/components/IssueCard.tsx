// ADD MORE ISSUES
export type IssueCategory = "Tech" | "Infrastructure" | "Academics" | "Other";
// ADD COLLEGES LATER
export type College = "CCNY" | "Hunter" | "Queens";

export interface IssueCardProps {
   id: string;
   title: string;
   description: string;
   category: IssueCategory;
   college: College;
   image?: string; // not sure how we're keeping images
   dateUploaded: string;
   username: string;
   upvotes: number;
   commentsCount: number;
   // isBookmarked: boolean;
}

// change the header of function to fit other components
const IssueCard: React.FC<IssueCardProps> = ({
   title,
   description,
   category,
   college,
   image,
   dateUploaded,
   username,
   upvotes,
   commentsCount,
}) => {
   // come back to this because lets do it down to the minutes
   const formattedDate = new Date(dateUploaded).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
   });

   const collegeColor = (college: string): string => {
      switch (college) {
         case "CCNY":
            return "bg-blue-500";
         case "Hunter":
            return "bg-purple-500";
         case "Queens":
            return "bg-yellow-500";
         default:
            return "bg-gray-500";
      }
   };

   return (
      // <article className="border border-gray-300 rounded-lg shadow-md p-4 mb-6 hover:shadow-lg transition-shadow duration-300">
      <article className="bg-gray-700 border border-gray-600 rounded-lg shadow-xl p-4 mb-6 hover:shadow-2xl transition-shadow duration-300 text-white">
         {/* Header: College, Date, Username, Title, Category */}
         <header className="mb-4">
            <div className="header-left mb-2 text-sm text-gray-400 inline-flex items-center space-x-2">
               <span
                  className={`rounded-full ${collegeColor(
                     college
                  )} text-white text-xs font-semibold px-2 py-1`}
               >
                  {college}
               </span>
               <span className="text-gray-500">•</span>
               <span className="">{formattedDate}</span>
               <span className="text-gray-500">•</span>
               <p className="font-thin">{username}</p>
            </div>
            <div>
               <h2 className="font-extrabold text-2xl mb-2">{title}</h2>
               <span className="rounded-full bg-gray-400 px-2 py-1 font-medium text-xs">
                  {category}
               </span>
            </div>
         </header>

         {/* post contents */}
         <div className="text-white">
            {image && (
               <img
                  src={image}
                  alt="Issue"
                  className="max-h-96 w-full object-cover rounded-md mb-4"
               />
            )}
            <p className="text-base mb-4 leading-relaxed wrap-anywhere">
               {description}
            </p>
         </div>

         {/* footer 
         future improvements: change buttons to svg icons
         */}
         <footer className="text-sm flex space-x-3">
            <button className="rounded-full bg-gray-400 font-semibold px-3 py-1 inline-flex items-center hover:bg-gray-500 transition-colors">
               <span className="mr-1">{upvotes}</span> Upvote
            </button>
            <button className="rounded-full bg-gray-400 font-semibold px-3 py-1 inline-flex items-center hover:bg-gray-500 transition-colors">
               <span className="mr-1">{commentsCount}</span> Comment
            </button>
            <button className="rounded-full bg-gray-400 font-semibold px-3 py-1 inline-flex items-center hover:bg-gray-500 transition-colors">
               Share
            </button>
         </footer>
      </article>
   );
};

export default IssueCard;
