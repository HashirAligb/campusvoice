import React, { useState } from "react";
import IssueCard from "./IssueCard";
import type { IssueCardProps, College, IssueCategory } from "./IssueCard";

type FilterOption = IssueCategory | "All";
type CollegeFilterOption = College | "All";

// future updates: deleting issues, editing issues
interface IssueListProps {
   issues: IssueCardProps[];
   onDeleteIssue?: (id: string) => void;
   // filterCollege?: CollegeFilterOption;
   // filterCategory?: FilterOption;
   filterCollege?: string;
   filterCategory?: string;
}

// when user is logged in, set college to their college
const IssueList: React.FC<IssueListProps> = ({
   issues,
   filterCollege = "All",
   filterCategory = "All",
   onDeleteIssue,
}) => {
   // const [filterCategory, setFilterCategory] = useState<FilterOption>("All");
   // const [filterCollege, setFilterCollege] =
   //    useState<CollegeFilterOption>("All");

   const filteredIssues = () => {
      if (filterCollege === "All" && filterCategory === "All") {
         return issues;
      } else if (filterCollege === "All") {
         return issues.filter((issue) => issue.category === filterCategory);
      } else if (filterCategory === "All") {
         return issues.filter((issue) => issue.college === filterCollege);
      } else {
         return issues.filter(
            (issue) =>
               issue.college === filterCollege &&
               issue.category === filterCategory
         );
      }
   };

   return (
      <div className='bg-gray-700 p-6 rounded-lg border border-gray-600 w-full'>
         <h2 className='text-xl font-semibold text-white mb-4'>
            Recent Issues
         </h2>

         {filteredIssues().length === 0 ? (
            <p className='text-gray-400'>No issues found.</p>
         ) : (
            // UPDATED
            filteredIssues().map((issue) => (
               <IssueCard key={issue.id} {...issue} onDelete={onDeleteIssue} />
            ))
         )}
      </div>
   );
};

export default IssueList;
