type Props = {
    isAuthenticated?: boolean;
    onLoginClick?: () => void;
    onSignupClick?: () => void;
    onLogoutClick?: () => void;
};

export default function AuthControls({ isAuthenticated = false, onLoginClick, onSignupClick, onLogoutClick }: Props) {
    if (!isAuthenticated) {
        return (
            <div className="flex gap-3">
                <button type="button" onClick={onLoginClick}
                className="bg-green-500 rounded-full px-4 py-3 text-white text-xl
                hover:bg-green-700 hover:scale-105 transform transition duration-300">
                    Log In
                </button>

                <button type="button" onClick={onSignupClick}
                className="border-2 border-green-500 rounded-full px-4 py-3 text-green-500 text-xl
                hover:bg-green-500 hover:text-white hover:scale-105 transform transition duration-300">
                    Sign Up
                </button>
            </div>
        )
    }

    return (
        <button type="button" onClick={onLoginClick}
        className="bg-red-500 rounded-full px-4 py-3 text-white text-xl
        hover:bg-red-700 hover:scale-105 transform transition duration-300">
            Log Out
        </button>
    )
}