import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

type BackToFeedButtonProps = {
    className?: string;
    to?: string;
};

export default function BackToFeedButton({ className = "", to }: BackToFeedButtonProps) {
    const navigate = useNavigate();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`text-sm text-gray-400 hover:text-white transition-colors cursor-pointer ${className}`}
        >
            ← Back to feed
        </button>
    );
}
