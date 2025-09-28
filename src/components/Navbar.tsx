import AuthControls from "./AuthControls";

export default function Navbar() {
    return (
        <div className="bg-gray-900 h-19 border-b border-gray-500">
            <div className="flex items-center justify-between h-full w-full px-6">
                <div className="
                    font-serif text-3xl font-bold bg-gradient-to-r from-green-500
                    via-green-400 to-green-200 bg-clip-text text-transparent">
                    CampusVoice
                </div>
                <AuthControls isAuthenticated={true} />
            </div>
        </div>
    )
}