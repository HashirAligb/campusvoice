// ADD MORE ISSUES
export type IssueCategory =
   | "Tech"
   | "Facilities"
   | "Infrastructure"
   | "Academics"
   | "Safety"
   | "Services"
   | "Other";
export type College =
   | "CCNY"
   | "Hunter"
   | "Queens"
   | "Baruch"
   | "Graduate Center"
   | "Guttman"
   | "John Jay"
   | "Macaulay"
   | "BMCC"
   | "Hostos"
   | "Lehman"
   | "Brooklyn"
   | "City Tech"
   | "Kingsborough"
   | "Medgar Evers"
   | "CIS"
   | "LaGuardia"
   | "Queensborough"
   | "York";

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
   onDelete?: (id: string) => void;
   // isBookmarked: boolean;
}

const IssueCard: React.FC<IssueCardProps> = ({
   id,
   title,
   description,
   category,
   college,
   image,
   dateUploaded,
   username,
   upvotes,
   commentsCount,
   onDelete,
}) => {
   const formattedDate = new Date(dateUploaded).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
   });

   const collegeColor = (college: string): string => {
      // add more colors later
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

   const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete) {
         onDelete(id);
      }
   };

   return (
      <article className='bg-gray-700 border border-gray-600 rounded-lg shadow-xl p-4 mb-6 hover:shadow-2xl transition-shadow duration-300 text-white relative'>
         {/* Header: College, Date, Username, Title, Category */}
         <header className='mb-4'>
            <div className='header-left mb-2 text-sm text-gray-400 inline-flex items-center space-x-2'>
               <span
                  className={`rounded-full ${collegeColor(
                     college
                  )} text-white text-xs font-semibold px-2 py-1`}
               >
                  {college}
               </span>
               <span className='text-gray-500'>•</span>
               <span className=''>{formattedDate}</span>
               <span className='text-gray-500'>•</span>
               <p className='font-thin'>{username}</p>
               {onDelete && (
                  <button
                     onClick={handleDelete}
                     className='text-white-500 hover:text-gray-500 text-sm float-right ml-4 cursor-pointer right-5 absolute font-bold'
                  >
                     X
                  </button>
               )}
            </div>
            <div>
               <h2 className='font-extrabold text-2xl mb-2'>{title}</h2>
               <span className='rounded-full bg-gray-400 px-2 py-1 font-medium text-xs'>
                  {category}
               </span>
            </div>
         </header>

         {/* post contents */}
         <div className='text-white'>
            {image && (
               <img
                  src={image}
                  alt='Issue'
                  className='max-h-96 w-full object-cover rounded-md mb-4'
               />
            )}
            <p className='text-base mb-4 leading-relaxed wrap-anywhere'>
               {description}
            </p>
         </div>

         {/* footer 
         future improvements: change buttons to svg icons
         */}
         <footer className='text-sm flex space-x-3'>
            <button className='rounded-full bg-gray-400 font-semibold px-3 py-1 inline-flex items-center hover:bg-gray-500 transition-colors cursor-pointer'>
               <span className='mr-1'>{upvotes}</span> Upvote
            </button>
            <button className='rounded-full bg-gray-400 font-semibold px-3 py-1 inline-flex items-center hover:bg-gray-500 transition-colors cursor-pointer'>
               <span className='mr-1'>{commentsCount}</span> Comment
            </button>
            <button className='rounded-full bg-gray-400 font-semibold px-3 py-1 inline-flex items-center hover:bg-gray-500 transition-colors cursor-pointer'>
               Share
            </button>
         </footer>
      </article>
   );
};

export default IssueCard;
