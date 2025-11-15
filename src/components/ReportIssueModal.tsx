import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/auth/useAuth";

interface ReportIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    defaultSchool?: string | null;
    defaultCategory?: string | null;
}

export default function ReportIssueModal({
    isOpen,
    onClose,
    onSuccess,
    defaultSchool,
    defaultCategory,
}: ReportIssueModalProps) {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [school, setSchool] = useState(defaultSchool || "");
    const [category, setCategory] = useState(defaultCategory || "");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cunySchools = [
        { name: "Queens College", code: "queens" },
        { name: "City College", code: "city" },
        { name: "Hunter College", code: "hunter" },
    ];

    const issueCategories = [
        "Academic Issues",
        "Facilities",
        "Technology",
        "Safety",
        "Student Services",
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB");
                return;
            }
            // Check file type
            if (!file.type.startsWith("image/")) {
                setError("Please select a valid image file");
                return;
            }
            setImage(file);
            setError(null);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!user) {
            setError("You must be logged in to report an issue");
            return;
        }

        if (!title.trim() || !description.trim() || !school || !category) {
            setError("Please fill in all required fields");
            return;
        }

        setLoading(true);

        try {
            let imageUrl: string | null = null;

            // Upload image if provided
            if (image) {
                const fileExt = image.name.split(".").pop();
                const fileName = `${user.id}-${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("issue-images")
                    .upload(filePath, image, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (uploadError) {
                    throw uploadError;
                }

                // Get public URL
                const { data } = supabase.storage
                    .from("issue-images")
                    .getPublicUrl(filePath);

                imageUrl = data.publicUrl;
            }

            // Create issue in database
            const { error: insertError } = await supabase.from("issues").insert({
                title: title.trim(),
                description: description.trim(),
                school,
                category,
                image_url: imageUrl,
                author_id: user.id,
                status: "open",
                upvotes: 0,
                downvotes: 0,
            });

            if (insertError) {
                throw insertError;
            }

            // Reset form
            setTitle("");
            setDescription("");
            setSchool(defaultSchool || "");
            setCategory(defaultCategory || "");
            setImage(null);
            setImagePreview(null);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to create issue. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setTitle("");
            setDescription("");
            setSchool(defaultSchool || "");
            setCategory(defaultCategory || "");
            setImage(null);
            setImagePreview(null);
            setError(null);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-gray-800 rounded-lg border border-gray-600 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gray-800 border-b border-gray-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-green-400">Report New Issue</h2>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-300">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                            placeholder="Brief description of the issue"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-300">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            disabled={loading}
                            rows={6}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 resize-none"
                            placeholder="Provide detailed information about the issue..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="school" className="block mb-1 text-sm font-medium text-gray-300">
                                School <span className="text-red-400">*</span>
                            </label>
                            <select
                                id="school"
                                value={school}
                                onChange={(e) => setSchool(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                <option value="">Select a school</option>
                                {cunySchools.map((s) => (
                                    <option key={s.code} value={s.code}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-300">
                                Category <span className="text-red-400">*</span>
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                <option value="">Select a category</option>
                                {issueCategories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="image" className="block mb-1 text-sm font-medium text-gray-300">
                            Image (Optional, max 5MB)
                        </label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={loading}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-600 file:text-white hover:file:bg-green-700 disabled:opacity-50"
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-w-full h-48 object-contain rounded-md border border-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        setImagePreview(null);
                                    }}
                                    className="mt-2 text-sm text-red-400 hover:text-red-300"
                                >
                                    Remove image
                                </button>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900 bg-opacity-50 border border-red-600 rounded-md text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Submitting..." : "Submit Issue"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

