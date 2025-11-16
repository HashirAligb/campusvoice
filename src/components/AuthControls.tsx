type Props = {
    loggedIn?: boolean;
    onLoginClick?: () => void;
    onSignupClick?: () => void;
    onLogoutClick?: () => void;
};

export default function AuthControls({ loggedIn, onLoginClick, onSignupClick, onLogoutClick }: Props) {
    if (!loggedIn) {
        return (
            <div className="flex gap-3">
                <button type="button" onClick={onLoginClick}
                className="bg-green-500 rounded-full px-4 py-3 text-white text-xl ml-4
                hover:bg-green-700 hover:scale-105 transform transition duration-300 whitespace-nowrap flex-shrink-0">
                    Log In
                </button>

                <button type="button" onClick={onSignupClick}
                className="border-2 border-green-500 rounded-full px-4 py-3 text-green-500 text-xl
                hover:bg-green-500 hover:scale-105 hover:text-white transform transition duration-300 whitespace-nowrap flex-shrink-0">
                    Sign Up
                </button>
            </div>
        )
    }
    return (
        <button type="button" onClick={onLogoutClick}
        className="bg-red-500 rounded-full px-4 py-2 ml-6 text-white text-lg
        hover:bg-red-700 hover:scale-105 transform transition duration-300 whitespace-nowrap flex-shrink-0">
            Log Out
        </button>
    )
}