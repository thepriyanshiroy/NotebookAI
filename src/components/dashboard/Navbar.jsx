import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ search, setSearch }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

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
    await signOut();
    navigate("/login");
  };

  return (
    <div
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
      `}</style>

      <nav
        className="navbar"
        style={{
          display: "flex",
          alignItems: "center",
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
        {/* Logo and Back */}
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
          {!isDashboard && (
            <button
              className="back-btn"
              onClick={() => navigate(-1)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                marginRight: "4px",
                flexShrink: 0,
              }}
              title="Go Back"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <div
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
          </div>
          <span
            className="nav-logo-text"
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "22px",
              color: "#fff",
              letterSpacing: "-0.025em",
            }}
          >
            Notebook<span style={{ color: "#22d3ee" }}>AI</span>
          </span>
        </div>

        {/* Search */}
        <div className="nav-center" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div className="nav-search-wrapper" style={{ position: "relative", width: "520px" }}>
            <svg
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
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m21 21-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
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

        {/* Right */}
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
          <div
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
            }}
          >
            {initials}
          </div>

          <span
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
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="16 17 21 12 16 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="21"
                y1="12"
                x2="9"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
