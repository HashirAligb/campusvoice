import { useState, useEffect } from "react";

interface SidebarProps {
    onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        onCollapseChange?.(isCollapsed);
    }, [isCollapsed, onCollapseChange]);

    const cunySchools = [
        { name: "Queens College", code: "queens" },
        { name: "City College", code: "city" },
        { name: "Hunter College", code: "hunter" },
    ];

    const issueCategories = [
        { name: "Academic Issues", icon: "📚" },
        { name: "Facilities", icon: "🏢" },
        { name: "Technology", icon: "💻" },
        { name: "Safety", icon: "🛡️" },
        { name: "Student Services", icon: "🎓" },
    ];

    if (isCollapsed) {
        return (
            <div className="w-4">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="w-full p-1 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Expand sidebar"
                >
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="space-y-6">
                {/* Header with collapse button */}
                <div className="flex items-center justify-between border-b border-gray-600 pb-4">
                    <h2 className="text-lg font-semibold text-green-400">Browse Issues</h2>
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="p-1 hover:bg-gray-700 rounded-md transition-colors"
                        title="Collapse sidebar"
                    >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* CUNY Schools Section */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
                        Schools
                    </h3>
                    <div className="space-y-1">
                        {cunySchools.map((school) => (
                            <button
                                key={school.code}
                                onClick={() => setSelectedSchool(selectedSchool === school.code ? null : school.code)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
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
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
                        Categories
                    </h3>
                    <div className="space-y-1">
                        {issueCategories.map((category) => (
                            <button
                                key={category.name}
                                onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center space-x-2 ${
                                    selectedCategory === category.name
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
                    <div className="border-t border-gray-600 pt-4">
                        <button
                            onClick={() => {
                                setSelectedSchool(null);
                                setSelectedCategory(null);
                            }}
                            className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-md text-sm hover:bg-gray-600 hover:text-white transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}