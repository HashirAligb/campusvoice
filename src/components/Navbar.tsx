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
  const { signOut, isAuthenticated, isLoading } = useAuth();
  const isHome = location.pathname === "/Home";

  console.log("Navbar path:", location.pathname, "isHome:", isHome);

  return (
    <div className="bg-[#12161f] h-19 z-50 border-b border-gray-500 sticky top-0">
      <div className="flex items-center justify-between h-full w-full px-6">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger Icon*/}
          <button className="xl:hidden p-2 mr-2 rounded hover:bg-gray-800" onClick={onOpenSidebar}>
            <span className="block w-5 h-0.5 bg-white mb-1" />
            <span className="block w-5 h-0.5 bg-white mb-1" />
            <span className="block w-5 h-0.5 bg-white" />
          </button>

          <Link to="/" className="hidden md:block font-serif text-3xl font-bold mr-4 sig-gradient">
            CampusVoice
          </Link>
        </div>

        {isHome && <IssuesSearch />}

        <AuthControls
          loading={isLoading}
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