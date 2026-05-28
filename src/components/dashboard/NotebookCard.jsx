import { useNavigate } from "react-router-dom";

const COLORS = [
  { primary: "#22d3ee", secondary: "#06b6d4", glow: "rgba(34,211,238,0.35)" },
  { primary: "#e879a0", secondary: "#db2777", glow: "rgba(232,121,160,0.35)" },
  { primary: "#f97316", secondary: "#ea580c", glow: "rgba(249,115,22,0.35)" },
  { primary: "#2dd4bf", secondary: "#0d9488", glow: "rgba(45,212,191,0.35)" },
  { primary: "#a78bfa", secondary: "#7c3aed", glow: "rgba(167,139,250,0.35)" },
  { primary: "#fbbf24", secondary: "#d97706", glow: "rgba(251,191,36,0.35)" },
];

const getColorObj = (hex) =>
  COLORS.find((c) => c.primary === hex) || COLORS[0];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return `${weeks}w ago`;
}

export default function NotebookCard({ notebook, onDelete }) {
  const navigate = useNavigate();
  const c = getColorObj(notebook.icon_color);
  const emoji = notebook.emoji || "📚";
  const sectionCount = notebook.sections?.[0]?.count ?? 0;

  return (
    <div
      onClick={() => navigate(`/notebook/${notebook.id}`)}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "28px 32px",
        cursor: "pointer",
        transition: "all 0.2s",
        position: "relative",
        overflow: "hidden",
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
        e.currentTarget.style.border = `1px solid ${c.primary}44`;
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = `0 24px 64px rgba(0,0,0,0.4), 0 0 48px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`;
        e.currentTarget.querySelector(".accent-line").style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)";
        e.currentTarget.querySelector(".accent-line").style.opacity = "0";
      }}
    >
      <div
        className="accent-line"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg,transparent,${c.primary}cc,transparent)`,
          opacity: 0,
          transition: "opacity 0.2s",
        }}
      />

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notebook.id);
        }}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.18)",
          fontSize: "20px",
          lineHeight: 1,
          padding: "4px 8px",
          borderRadius: "8px",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#f87171";
          e.currentTarget.style.background = "rgba(248,113,113,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.18)";
          e.currentTarget.style.background = "none";
        }}
      >
        ×
      </button>

      {/* Emoji + time */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "16px",
            background: `${c.primary}18`,
            border: `1px solid ${c.primary}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            boxShadow: `0 4px 20px ${c.glow}`,
          }}
        >
          {emoji}
        </div>
        <span
          style={{
            color: "rgba(150,200,255,0.35)",
            fontSize: "13px",
            fontWeight: 500,
            marginTop: "6px",
            marginRight: "28px",
          }}
        >
          {timeAgo(notebook.updated_at)}
        </span>
      </div>

      <h3
        style={{
          fontFamily: "'Syne',sans-serif",
          fontWeight: 700,
          fontSize: "21px",
          color: "#fff",
          marginBottom: "6px",
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
          paddingRight: "24px",
        }}
      >
        {notebook.title}
      </h3>
      <p
        style={{
          color: "rgba(150,200,255,0.4)",
          fontSize: "14px",
          marginBottom: "24px",
        }}
      >
        {notebook.subject || "No subject"}
      </p>

      {/* Count + line */}
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div>
          <p
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: "24px",
              color: c.primary,
              lineHeight: 1,
              textShadow: `0 0 20px ${c.glow}`,
            }}
          >
            {sectionCount}
          </p>
          <p
            style={{
              color: "rgba(150,200,255,0.35)",
              fontSize: "12px",
              marginTop: "3px",
            }}
          >
            Sections
          </p>
        </div>
        <div
          style={{
            flex: 1,
            height: "3px",
            borderRadius: "999px",
            background: `linear-gradient(90deg, ${c.primary}, ${c.primary}20)`,
            boxShadow: `0 0 10px ${c.glow}`,
          }}
        />
      </div>
    </div>
  );
}
