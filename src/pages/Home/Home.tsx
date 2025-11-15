import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import ReportIssueModal from "@/components/ReportIssueModal";
import { useState } from "react";

export default function Home() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleModalSuccess = () => {
        // Trigger refresh of the feed
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-[#0c0e14]">
            <Navbar />
            <div className="flex">
            {/* Sidebar */}
                <div
                    className={`${
                    sidebarCollapsed ? 'w-12' : 'w-60'
                    } min-h-screen bg-[#12161f] border-r border-gray-600 overflow-hidden transition-[width] duration-150`}
                >
                    <div className="p-4">
                    <Sidebar
                        onCollapseChange={setSidebarCollapsed}
                        selectedSchool={selectedSchool}
                        selectedCategory={selectedCategory}
                        onSchoolChange={setSelectedSchool}
                        onCategoryChange={setSelectedCategory}
                    />
                    </div>
                </div>

                {/* Feed */}
                <div className="flex-1 py-4">
                    {/* Center feed & quick actions on the page */}
                    <div className="flex max-w-6xl mx-auto gap-8 px-4">
                        <div className="flex-1">
                            <div className="max-w-3xl">
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

                        {/* Quick Actions */}
                        <div className="w-70">
                            <div className="bg-[#12161f] p-6 rounded-xl border border-gray-600">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Quick Actions
                            </h3>
                                <div className="space-y-3">
                                    <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
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