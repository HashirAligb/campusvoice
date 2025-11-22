import { useState, useEffect } from "react";

interface SidebarProps {
    selectedSchools?: string[];
    selectedCategories?: string[];
    onSchoolsChange?: (schools: string[]) => void;
    onCategoriesChange?: (categories: string[]) => void;
    isOpen?: boolean
    onToggleSidebar?: () => void
}

export default function Sidebar({
    selectedSchools: externalSelectedSchools,
    selectedCategories: externalSelectedCategories,
    onSchoolsChange,
    onCategoriesChange,
    isOpen = true,
    onToggleSidebar,
}: SidebarProps) {
    const [selectedSchools, setSelectedSchools] = useState<string[]>(externalSelectedSchools || []);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(externalSelectedCategories || []);
    const [isSchoolListOpen, setIsSchoolListOpen] = useState(false);

    // Sync with external state
    useEffect(() => {
        if (externalSelectedSchools !== undefined) {
            setSelectedSchools(externalSelectedSchools);
        }
    }, [externalSelectedSchools]);

    useEffect(() => {
        if (externalSelectedCategories !== undefined) {
            setSelectedCategories(externalSelectedCategories);
        }
    }, [externalSelectedCategories]);

    const toggleSchool = (school: string) => {
        setSelectedSchools((prev) => {
            const next = prev.includes(school)
                ? prev.filter((item) => item !== school)
                : [...prev, school];
            onSchoolsChange?.(next);
            return next;
        });
    };

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) => {
            const next = prev.includes(category)
                ? prev.filter((item) => item !== category)
                : [...prev, category];
            onCategoriesChange?.(next);
            return next;
        });
    };

    const clearFilters = () => {
        setSelectedSchools([]);
        setSelectedCategories([]);
        onSchoolsChange?.([]);
        onCategoriesChange?.([]);
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
        <div className="w-full pl-3 min-h-[calc(100vh-6.75rem)]">
            <div className="space-y-6">
                {/* Header with close button */}
                <div
                    className={`flex items-center justify-between border-b pb-4 ${
                        isOpen ? "border-gray-600" : "border-transparent"
                    }`}
                >
                    <h2 className="text-lg font-semibold text-green-400">Browse Issues</h2>
                    <button
                        onClick={onToggleSidebar}
                        className="-mr-4 p-1 hover:bg-gray-700 rounded-md transition-colors"
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

                <div
                    className={`space-y-6 transition-opacity duration-200 ${
                        isOpen ? "opacity-100" : "opacity-0 pointer-events-none select-none"
                    }`}
                    aria-hidden={!isOpen}
                >
                    {/* CUNY Schools Section */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setIsSchoolListOpen(prev => !prev)}
                            className="w-full flex items-center justify-between text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3"
                        >
                            <span>Schools</span>
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
                                    d={isSchoolListOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                                />
                            </svg>
                        </button>
                        {isSchoolListOpen && (
                            <div className="space-y-1">
                                {cunySchools.map((school) => (
                                    <button
                                        key={school.code}
                                        onClick={() => toggleSchool(school.code)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                            selectedSchools.includes(school.code)
                                                ? "bg-green-600 text-white"
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                        }`}
                                    >
                                        {school.name}
                                    </button>
                                ))}
                            </div>
                        )}
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
                                onClick={() => toggleCategory(category.name)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center space-x-2 ${
                                selectedCategories.includes(category.name)
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
                    {(selectedSchools.length > 0 || selectedCategories.length > 0) && (
                        <div className="border-t border-gray-600 pt-4">
                            <button onClick={clearFilters} className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-md text-sm hover:bg-gray-600 hover:text-white transition-colors">
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
