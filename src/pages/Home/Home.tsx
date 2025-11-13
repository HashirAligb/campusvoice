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
        <div className="min-h-screen bg-[#0D121F]">
            <Navbar />
            <div className="flex">
                <div className={`${sidebarCollapsed ? 'w-12' : 'w-80'} min-h-screen bg-gray-900 border-r border-gray-600 overflow-hidden transition-[width] duration-300`}>
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
                <div className="flex-1 flex items-start gap-6 px-4 py-4 max-w-5xl">
                    <div className="flex-1 max-w-2xl">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-white mb-4">Recent Issues</h2>
                            <Feed
                                selectedSchool={selectedSchool}
                                selectedCategory={selectedCategory}
                                refreshTrigger={refreshTrigger}
                            />
                        </div>
                    </div>
                    <div className="w-80 sticky top-4">
                        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
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