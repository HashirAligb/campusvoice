import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Home/Sidebar";
import Feed from "@/components/Home/Feed";
import ReportIssueModal from "@/components/ReportIssueModal";

export default function Home() {
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleModalSuccess = () => {
        setRefreshTrigger((prev) => prev + 1);
    };
    
    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 -z-10 w-full [background:radial-gradient(125%_125%_at_50%_10%,#0d1017_60%,#4b5563_100%)]" />
            {/* Navbar: hamburger on mobile triggers mobile sidebar */}
            <Navbar
                onOpenSidebar={() => {
                    setIsMobileSidebarOpen(true);
                }}
            />

            {/* Mobile overlay sidebar */}
            <div
                className={`fixed top-19 inset-y-0 left-0 z-40 w-70 bg-[#12161f] border-r border-gray-600 
                            transition-transform duration-150 xl:hidden 
                            ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="h-full overflow-y-auto p-4 sidebar-scroll">
                    <Sidebar
                        selectedSchool={selectedSchool}
                        selectedCategory={selectedCategory}
                        onSchoolChange={setSelectedSchool}
                        onCategoryChange={setSelectedCategory}
                        isOpen={isMobileSidebarOpen}
                        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
                    />
                </div>
            </div>

            {/* Mobile backdrop */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 xl:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            <div className="flex">
                {/* Desktop Sidebar */}
                <div className="hidden xl:block">
                    <div className="sticky top-19">
                        {/* Slide-in/out container */}
                        <div
                            className={`w-90 h-full bg-[#12161f] border-r border-gray-600 transition-transform
                                        duration-300 ${isDesktopSidebarOpen ? "translate-x-0" : "-translate-x-[90%]"}`}
                        >
                            <div className={`max-h-[calc(100vh-5rem)] p-4 pr-10 ${isDesktopSidebarOpen ? "overflow-y-auto sidebar-scroll" : "overflow-hidden" }`}>
                                <Sidebar
                                    selectedSchool={selectedSchool}
                                    selectedCategory={selectedCategory}
                                    onSchoolChange={setSelectedSchool}
                                    onCategoryChange={setSelectedCategory}
                                    isOpen={isDesktopSidebarOpen}
                                    onToggleSidebar={() => setIsDesktopSidebarOpen((prev) => !prev)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feed */}
                <div className="flex-1 py-4">
                    <div className="flex max-w-8xl mx-10 gap-8 px-4">
                        <div className="flex-1">
                            <div className="max-w-4xl">
                                <h2 className="text-2xl font-semibold text-white mb-2">
                                    Recent Issues
                                </h2>
                                <Feed
                                    selectedSchool={selectedSchool}
                                    selectedCategory={selectedCategory}
                                    refreshTrigger={refreshTrigger}
                                />
                            </div>
                        </div>

                        {/* Quick Actions (hide on mobile) */}
                        <div className="hidden lg:block w-70 self-start sticky top-23">
                            <div className="bg-[#12161f] p-6 rounded-xl border border-gray-600">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full btn-border-reveal py-2 px-4 rounded-md"
                                    >
                                        Report New Issue
                                    </button>
                                    <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-500 transition-colors">
                                        View My Issues
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ReportIssueModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                defaultSchool={selectedSchool}
                defaultCategory={selectedCategory}
            />
        </div>
    );
}