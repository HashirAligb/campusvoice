import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import IssueList from "@/components/IssueList";
import type { IssueCardProps } from "@/components/IssueCard";
import { useState } from "react";

export default function Home() {
   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

   const [issues, setIssues] = useState<IssueCardProps[]>([
      {
         id: "127847123",
         title: "hello",
         description:
            "this is a test!!! for testing testing testing testing testing testing testing testing testing testing testing testing testing testing testing testing testing testing",
         category: "Infrastructure",
         college: "Hunter",
         dateUploaded: "2023-10-01T12:34:56Z",
         username: "maida",
         upvotes: 0,
         commentsCount: 0,
      },
      {
         id: "127836217",
         title: "TEST!!!!!!!!!!!!!!!!!!!!!!!!!!!",
         description:
            "TESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTING",
         category: "Tech",
         college: "CCNY",
         dateUploaded: "2023-10-01T12:34:56Z",
         username: "maidamaidamaidamaidamaidamaidamaidamaidamaidamaida",
         upvotes: 0,
         commentsCount: 0,
      },
   ]);

   const handleDeleteIssue = (id: string): void => {
      setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== id));
   };

   return (
      <div className='min-h-screen bg-gray-800'>
         <Navbar />
         <div className='flex'>
            <div
               className={`${
                  sidebarCollapsed ? "w-12" : "w-64"
               } min-h-screen bg-gray-800 ${
                  sidebarCollapsed ? "" : "border-r border-gray-600"
               } transition-all duration-300`}
            >
               <div className='p-4'>
                  <Sidebar onCollapseChange={setSidebarCollapsed} />
               </div>
            </div>
            <div className='flex-1 flex items-start gap-6 px-4 py-4 max-w-5xl'>
               <div className='flex-1 max-w-2xl'>
                  <IssueList
                     issues={issues}
                     onDeleteIssue={handleDeleteIssue}
                  ></IssueList>
               </div>
               <div className='w-80 sticky top-4'>
                  <div className='bg-gray-700 p-6 rounded-lg border border-gray-600'>
                     <h3 className='text-lg font-semibold text-white mb-4'>
                        Quick Actions
                     </h3>
                     <div className='space-y-3'>
                        <button className='w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors'>
                           Report New Issue
                        </button>
                        <button className='w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-500 transition-colors'>
                           View My Issues
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
