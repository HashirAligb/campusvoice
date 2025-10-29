import { useState, useEffect } from "react";

interface SidebarProps {
   onCollapseChange?: (collapsed: boolean) => void;
   setSelectedSchool: (school: string) => void;
   setSelectedCategory: (category: string) => void;
   selectedSchool?: string | null;
   selectedCategory?: string | null;
}

export default function Sidebar({
   onCollapseChange,
   setSelectedSchool,
   setSelectedCategory,
   selectedSchool,
   selectedCategory,
}: SidebarProps) {
   const [isCollapsed, setIsCollapsed] = useState(false);

   useEffect(() => {
      onCollapseChange?.(isCollapsed);
   }, [isCollapsed, onCollapseChange]);

   const cunySchools = [
      { name: "Queens College", code: "Queens" },
      { name: "City College", code: "CCNY" },
      { name: "Hunter College", code: "Hunter" },
   ];

   const issueCategories = [
      { name: "Academic Issues", code: "Academics", icon: "📚" },
      { name: "Facilities", code: "Facilities", icon: "🏢" },
      { name: "Technology", code: "Tech", icon: "💻" },
      { name: "Safety", code: "Safety", icon: "🛡️" },
      { name: "Student Services", code: "Services", icon: "🎓" },
   ];

   if (isCollapsed) {
      return (
         <div className='w-4'>
            <button
               onClick={() => setIsCollapsed(false)}
               className='w-full p-1 hover:bg-gray-700 rounded-lg transition-colors'
               title='Expand sidebar'
            >
               <svg
                  className='w-4 h-4 text-gray-300'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
               >
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={2}
                     d='M9 5l7 7-7 7'
                  />
               </svg>
            </button>
         </div>
      );
   }

   return (
      <div className='w-full pl-2'>
         <div className='space-y-6'>
            {/* Header with collapse button */}
            <div className='flex items-center justify-between border-b border-gray-600 pb-4'>
               <h2 className='text-lg font-semibold text-green-400'>
                  Browse Issues
               </h2>
               <button
                  onClick={() => setIsCollapsed(true)}
                  className='p-1 hover:bg-gray-700 rounded-md transition-colors'
                  title='Collapse sidebar'
               >
                  <svg
                     className='w-4 h-4 text-gray-400'
                     fill='none'
                     stroke='currentColor'
                     viewBox='0 0 24 24'
                  >
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 19l-7-7 7-7'
                     />
                  </svg>
               </button>
            </div>

            {/* CUNY Schools Section */}
            <div>
               <h3 className='text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3'>
                  Schools
               </h3>
               <div className='space-y-1'>
                  {cunySchools.map((school) => (
                     <button
                        key={school.code}
                        onClick={() =>
                           setSelectedSchool(
                              selectedSchool === school.code
                                 ? "All"
                                 : school.code
                           )
                        }
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                           selectedSchool === school.code
                              ? "bg-green-600 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                     >
                        {school.name}
                     </button>
                  ))}
               </div>
            </div>

            {/* Issue Categories Section */}
            <div>
               <h3 className='text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3'>
                  Categories
               </h3>
               <div className='space-y-1'>
                  {issueCategories.map((category) => (
                     <button
                        key={category.name}
                        onClick={() =>
                           setSelectedCategory(
                              selectedCategory === category.code
                                 ? "All"
                                 : category.code
                           )
                        }
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center space-x-2 cursor-pointer ${
                           selectedCategory === category.code
                              ? "bg-green-600 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                     >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                     </button>
                  ))}
               </div>
            </div>

            {/* Clear Filters */}
            {(selectedSchool || selectedCategory) && (
               <div className='border-t border-gray-600 pt-4'>
                  <button
                     onClick={() => {
                        setSelectedSchool("All");
                        setSelectedCategory("All");
                     }}
                     className='w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-md text-sm hover:bg-gray-600 hover:text-white transition-colors cursor-pointer'
                  >
                     Clear Filters
                  </button>
               </div>
            )}
         </div>
      </div>
   );
}
