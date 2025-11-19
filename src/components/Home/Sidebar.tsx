import { useState, useEffect } from "react";

interface SidebarProps {
    selectedSchool?: string | null;
    selectedCategory?: string | null;
    onSchoolChange?: (school: string | null) => void;
    onCategoryChange?: (category: string | null) => void;
    isOpen?: boolean
    onToggleSidebar?: () => void
}

export default function Sidebar({
    selectedSchool: externalSelectedSchool,
    selectedCategory: externalSelectedCategory,
    onSchoolChange,
    onCategoryChange,
    isOpen = true,
    onToggleSidebar,
}: SidebarProps) {
    const [selectedSchool, setSelectedSchool] = useState<string | null>(
        externalSelectedSchool || null
    );
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        externalSelectedCategory || null
    );

    // Sync with external state
    useEffect(() => {
        if (externalSelectedSchool !== undefined) {
            setSelectedSchool(externalSelectedSchool);
        }
    }, [externalSelectedSchool]);

    useEffect(() => {
        if (externalSelectedCategory !== undefined) {
            setSelectedCategory(externalSelectedCategory);
        }
    }, [externalSelectedCategory]);

    const handleSchoolChange = (school: string | null) => {
        setSelectedSchool(school);
        onSchoolChange?.(school);
    };

    const handleCategoryChange = (category: string | null) => {
        setSelectedCategory(category);
        onCategoryChange?.(category);
    };

    const cunySchools = [
        { name: "Baruch College", code: "baruch" },
        { name: "Borough of Manhattan Community College", code: "bmcc" },
        { name: "Bronx Community College", code: "bronx community" },
        { name: "Brooklyn College", code: "brooklyn" },
        { name: "City College", code: "city" },
        { name: "College of Staten Island", code: "staten island" },
        { name: "Guttman Community College", code: "guttman" },
        { name: "Hostos Community College", code: "hostos" },
        { name: "Hunter College", code: "hunter" },
        { name: "John Jay College of Criminal Justice", code: "john jay" },
        { name: "Kingsborough Community College", code: "kingsborough" },
        { name: "LaGuardia Community College", code: "laguardia" },
        { name: "Lehman College", code: "lehman" },
        { name: "Medgar Evers College", code: "medgar evers" },
        { name: "New York City College of Technology", code: "city tech" },
        { name: "Queens College", code: "queens" },
        { name: "Queens Community College", code: "queens community" },
        { name: "York College", code: "york" }
    ];

    const issueCategories = [
        { name: "Academic Issues", icon: "📚" },
        { name: "Facilities", icon: "🏢" },
        { name: "Technology", icon: "💻" },
        { name: "Safety", icon: "🛡️" },
        { name: "Student Services", icon: "🎓" },
    ];

    return (
        <div className="w-full pl-2">
            <div className="space-y-6">
                {/* Header with close button */}
                <div className="flex items-center justify-between border-b border-gray-600 pb-4 w-[92%]">
                    <h2 className="text-lg font-semibold text-green-400">Browse Issues</h2>
                    <button
                        onClick={onToggleSidebar}
                        className="p-1 -mr-14.5 hover:bg-gray-700 rounded-md transition-colors"
                        title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                            />
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
                            onClick={() => handleSchoolChange(
                                selectedSchool === school.code ? null : school.code
                            )}
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
                            onClick={() => handleCategoryChange(
                                selectedCategory === category.name ? null : category.name
                            )}
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
                        <button onClick={() => {
                            handleSchoolChange(null);
                            handleCategoryChange(null);
                        }} className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-md text-sm hover:bg-gray-600 hover:text-white transition-colors">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}