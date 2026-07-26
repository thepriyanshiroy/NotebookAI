import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const NavBtn = ({ label, active, onClick, count, icon }) => (
  <button
    onClick={onClick}
    type="button"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "14px 18px",
      borderRadius: "16px",
      marginBottom: "6px",
      width: "100%",
      textAlign: "left",
      background: active
        ? "linear-gradient(135deg, rgba(34,211,238,0.16), rgba(6,182,212,0.06))"
        : "transparent",
      border: active
        ? "1px solid rgba(34,211,238,0.28)"
        : "1px solid transparent",
      boxShadow: active
        ? "0 4px 28px rgba(34,211,238,0.12), inset 0 1px 0 rgba(255,255,255,0.07)"
        : "none",
      cursor: "pointer",
      transition: "all 0.15s",
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.border = "1px solid transparent";
      }
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        flexShrink: 0,
        background: active ? "rgba(34,211,238,0.18)" : "rgba(255,255,255,0.06)",
        border: active
          ? "1px solid rgba(34,211,238,0.3)"
          : "1px solid rgba(255,255,255,0.09)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: active ? "0 0 16px rgba(34,211,238,0.25)" : "none",
        transition: "all 0.15s",
      }}
    >
      {icon(active)}
    </div>

    <span
      style={{
        flex: 1,
        fontFamily: "'DM Sans',sans-serif",
        color: active ? "#e8f8ff" : "rgba(180,220,255,0.5)",
        fontWeight: active ? 700 : 500,
        fontSize: "16px",
        transition: "all 0.15s",
      }}
    >
      {label}
    </span>

    {count !== undefined && (
      <span
        style={{
          background: active ? "rgba(34,211,238,0.22)" : "rgba(255,255,255,0.07)",
          color: active ? "#22d3ee" : "rgba(150,200,255,0.4)",
          fontSize: "13px",
          fontWeight: 700,
          padding: "3px 12px",
          borderRadius: "999px",
          border: active
            ? "1px solid rgba(34,211,238,0.35)"
            : "1px solid rgba(255,255,255,0.09)",
          boxShadow: active ? "0 0 10px rgba(34,211,238,0.2)" : "none",
        }}
      >
        {count}
      </span>
    )}
  </button>
);

const BookIcon = (active) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={active ? "#22d3ee" : "rgba(150,200,255,0.45)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={active ? "#22d3ee" : "rgba(150,200,255,0.45)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SaveIcon = (active) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke={active ? "#22d3ee" : "rgba(150,200,255,0.45)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Sidebar({ notebookCount, className, onItemClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [dbCount, setDbCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  const isNotebooks =
    location.pathname === "/dashboard" ||
    location.pathname === "/notebooks" ||
    location.pathname.startsWith("/notebook");
  const isSaved = location.pathname === "/saved";

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user) return;
      
      if (notebookCount === undefined || notebookCount === null) {
        const { count: nbCount } = await supabase
          .from("notebooks")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        setDbCount(nbCount || 0);
      }

      const { count: svCount } = await supabase
        .from("saved_pdfs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setSavedCount(svCount || 0);
    };
    fetchCounts();
  }, [notebookCount, user]);

  const displayCount = notebookCount ?? dbCount;

  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";
  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleNav = (path) => {
    navigate(path);
    if (onItemClick) onItemClick();
  };

  return (
    <aside
      className={className || "sidebar-container"}
      style={{
        width: "290px",
        background: "rgba(5,7,18,0.7)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
      }}
    >
      <p
        style={{
          color: "rgba(34,211,238,0.38)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          padding: "0 12px",
          marginBottom: "14px",
        }}
      >
        Library
      </p>

      <NavBtn
        label="Notebooks"
        active={isNotebooks}
        onClick={() => handleNav("/notebooks")}
        icon={BookIcon}
      />
      <NavBtn
        label="Saved"
        active={isSaved}
        onClick={() => handleNav("/saved")}
        icon={SaveIcon}
      />

      <div className="user-card" style={{ marginTop: "auto" }}>
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.06)",
            marginBottom: "16px",
            marginLeft: "4px",
            marginRight: "4px",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              flexShrink: 0,
              background: "linear-gradient(135deg, #22d3ee, #e879a0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "14px",
              boxShadow: "0 0 18px rgba(34,211,238,0.35)",
            }}
          >
            {initials}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fullName || "Student"}
            </p>
            <p style={{ color: "rgba(34,211,238,0.45)", fontSize: "12px", marginTop: "2px" }}>
              Student
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
