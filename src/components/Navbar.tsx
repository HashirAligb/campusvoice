import AuthControls from "./AuthControls";
import { useAuth } from "@/auth/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import IssuesSearch from "./Search/IssuesSearch";

type NavbarProps = {
  onOpenSidebar?: () => void;
};

export default function Navbar({ onOpenSidebar }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, isAuthenticated } = useAuth();
  const isHome = location.pathname === "/Home";

  console.log("Navbar path:", location.pathname, "isHome:", isHome);

  return (
    <div className="bg-[#12161f] h-19 border-b border-gray-500">
      <div className="flex items-center justify-between h-full w-full px-6">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            className="xl:hidden p-2 mr-2 rounded hover:bg-gray-800"
            onClick={onOpenSidebar}
          >
            {/* simple icon */}
            <span className="block w-5 h-0.5 bg-white mb-1" />
            <span className="block w-5 h-0.5 bg-white mb-1" />
            <span className="block w-5 h-0.5 bg-white" />
          </button>

          <Link
            to="/"
            className="hidden md:block font-serif text-3xl font-bold mr-4 bg-gradient-to-r from-green-500 via-green-400 to-green-200 bg-clip-text text-transparent"
          >
            CampusVoice
          </Link>
        </div>

        {isHome && <IssuesSearch />}

        <AuthControls
          loggedIn={isAuthenticated}
          onLoginClick={() => navigate("/Login")}
          onSignupClick={() => navigate("/Signup")}
          onLogoutClick={() => {
            signOut();
            navigate("/");
          }}
        />
      </div>
    </div>
  );
}