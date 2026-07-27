import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ search, setSearch, onMenuClick }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const [profileOpen, setProfileOpen] = useState(false);

  const fullName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";
  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const firstName = fullName.split(" ")[0];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setProfileOpen(false);
      navigate("/login");
    }
  };

  const handleBack = () => {
    if (location.pathname.startsWith("/notebook")) {
      navigate("/notebooks");
      return;
    }

    if (location.pathname === "/notebooks" || location.pathname === "/saved") {
      navigate("/dashboard");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div
      className="navbar-container"
      style={{
        padding: "14px 20px 0 20px",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .nav-search { transition: border-color 0.2s, box-shadow 0.2s; }
        .nav-search::placeholder { color: rgba(180,210,255,0.22); }
        .nav-search:focus { outline: none; border-color: rgba(34,211,238,0.45) !important; box-shadow: 0 0 0 3px rgba(34,211,238,0.08) !important; }
        .logout-btn { transition: color 0.15s; }
        .logout-btn:hover { color: #22d3ee !important; }
        .back-btn { transition: all 0.2s; }
        .back-btn:hover { background: rgba(34,211,238,0.1) !important; color: #22d3ee !important; }
        
        .navbar-container { padding: 14px 20px 0 20px; position: sticky; top: 0; z-index: 30; }
        
        @media (max-width: 1024px) {
          .nav-left, .nav-right { width: auto !important; }
          .nav-search-wrapper { width: 100% !important; max-width: 400px !important; }
        }
        
        @media (max-width: 767px) {
          .navbar-container { padding: 10px 12px 0 12px !important; }
          .navbar {
            padding: 0 12px !important;
            height: 60px !important;
            border-radius: 12px !important;
            gap: 8px !important;
          }
          .nav-left { gap: 6px !important; }
          .nav-right { gap: 8px !important; flex-shrink: 1 !important; }
          .nav-brand-button { gap: 6px !important; }
          .nav-logo-mark {
            width: 30px !important;
            height: 30px !important;
            font-size: 15px !important;
          }
          .nav-logo-text {
            font-size: 16px !important;
          }
          
          /* Show search icon button instead of full search bar, or just shrink it */
          .nav-search-wrapper {
             max-width: 100% !important;
          }
          .nav-search {
            padding-left: 36px !important;
            padding-right: 12px !important;
            font-size: 13px !important;
          }
          .nav-search-icon {
            left: 12px !important;
            width: 14px !important;
            height: 14px !important;
          }
          
          /* Hide non-essential elements on mobile */
          .nav-right-name, .nav-divider, .logout-btn {
            display: none !important;
          }
          
          .nav-avatar {
            width: 32px !important;
            height: 32px !important;
            font-size: 12px !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        
        @media (max-width: 400px) {
          .nav-logo-text { display: none !important; } /* Hide 'NotebookAI' text on very small screens to fit search */
          .nav-search-wrapper { flex: 1 !important; }
        }
      `}</style>

      <nav
        className="navbar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: "70px",
          borderRadius: "18px",
          background: "rgba(8,12,30,0.94)",
          backdropFilter: "blur(48px)",
          WebkitBackdropFilter: "blur(48px)",
          border: "1px solid rgba(34,211,238,0.2)",
          boxShadow:
            "0 0 0 1px rgba(34,211,238,0.05), 0 12px 60px rgba(0,0,0,0.65), 0 0 120px rgba(34,211,238,0.07)",
        }}
      >
        <div
          className="nav-left"
          style={{
            width: "260px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            className="mobile-menu-btn"
            onClick={onMenuClick}
            type="button"
            aria-label="Open navigation"
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.9)",
              cursor: "pointer",
              marginRight: "4px",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>


          <button
            className="nav-brand-button"
            onClick={() => navigate("/dashboard")}
            type="button"
            aria-label="Go to dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              minWidth: 0,
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            <span
              className="nav-logo-mark"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #22d3ee, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "19px",
                color: "#000",
                boxShadow: "0 0 28px rgba(34,211,238,0.6)",
                flexShrink: 0,
              }}
            >
              N
            </span>
            <span
              className="nav-logo-text"
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: "22px",
                color: "#fff",
                letterSpacing: "-0.025em",
                whiteSpace: "nowrap",
              }}
            >
              Notebook<span style={{ color: "#22d3ee" }}>AI</span>
            </span>
          </button>
        </div>

        <div className="nav-center" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div className="nav-search-wrapper" style={{ position: "relative", width: "100%", maxWidth: "520px" }}>
            <svg
              className="nav-search-icon"
              style={{
                position: "absolute",
                left: "18px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "rgba(34,211,238,0.5)",
              }}
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              className="nav-search"
              placeholder="Search notebooks, PDFs, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "48px",
                paddingRight: "20px",
                paddingTop: "12px",
                paddingBottom: "12px",
                borderRadius: "999px",
                fontSize: "15px",
                color: "#e0f0ff",
                background: "rgba(34,211,238,0.06)",
                border: "1px solid rgba(34,211,238,0.18)",
                fontFamily: "'DM Sans',sans-serif",
              }}
            />
          </div>
        </div>

        <div
          className="nav-right"
          style={{
            width: "260px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "14px",
          }}
        >
          <button
            className="nav-avatar"
            onClick={() => {
              if (window.innerWidth <= 768) setProfileOpen(true);
            }}
            type="button"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #22d3ee, #e879a0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "14px",
              boxShadow: "0 0 22px rgba(34,211,238,0.45)",
              flexShrink: 0,
              border: "none",
              cursor: "pointer",
            }}
            aria-label={`Signed in as ${fullName}`}
            title={fullName}
          >
            {initials}
          </button>

          <span
            className="nav-right-name"
            style={{
              color: "rgba(200,225,255,0.75)",
              fontSize: "15px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              maxWidth: "100px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {firstName}
          </span>

          <div
            className="nav-divider"
            style={{
              width: "1px",
              height: "22px",
              background: "rgba(255,255,255,0.12)",
              flexShrink: 0,
            }}
          />

          <button
            className="logout-btn"
            onClick={handleLogout}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              color: "rgba(150,200,255,0.5)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
              fontFamily: "'DM Sans',sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      <div
        className={`profile-drawer-overlay ${profileOpen ? "open" : ""}`}
        onClick={() => setProfileOpen(false)}
      />
      <aside
        className={`profile-drawer ${profileOpen ? "open" : ""}`}
        aria-hidden={!profileOpen}
        aria-label="Profile menu"
      >
        <div className="profile-drawer-user">
          <div className="profile-drawer-avatar">{initials || "S"}</div>
          <div>
            <p>{fullName || "Student"}</p>
            <span>{user?.email || "Signed in"}</span>
          </div>
        </div>
        <button className="profile-drawer-logout" type="button" onClick={handleLogout}>
          Logout
        </button>
      </aside>
    </div>
  );
}
