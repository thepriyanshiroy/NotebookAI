import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({
  title,
  search,
  setSearch,
  searchPlaceholder = "Search workspace",
}) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname.startsWith("/notebook");
  const canSearch = typeof search === "string" && typeof setSearch === "function";

  const fullName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";
  const initials = fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="app-topbar">
      <div className="topbar-title-group">
        {showBack && (
          <button
            className="icon-button"
            onClick={() => navigate("/notebooks")}
            aria-label="Back to notebooks"
            type="button"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <div>
          <p className="topbar-kicker">NotebookAI</p>
          <h1>{title}</h1>
        </div>
      </div>

      {canSearch && (
        <label className="topbar-search">
          <span className="sr-only">{searchPlaceholder}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            type="search"
          />
        </label>
      )}

      <div className="topbar-actions">
        <button
          className="profile-pill"
          type="button"
          title={fullName}
          aria-label={`Signed in as ${fullName}`}
        >
          <span>{initials}</span>
        </button>
        <button
          className="logout-compact"
          onClick={handleLogout}
          type="button"
          aria-label="Log out"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
