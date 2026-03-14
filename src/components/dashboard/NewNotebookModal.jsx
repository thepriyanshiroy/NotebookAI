import { useState } from "react";

const COLORS = [
  { primary: "#22d3ee", secondary: "#06b6d4", glow: "rgba(34,211,238,0.35)" },
  { primary: "#e879a0", secondary: "#db2777", glow: "rgba(232,121,160,0.35)" },
  { primary: "#f97316", secondary: "#ea580c", glow: "rgba(249,115,22,0.35)" },
  { primary: "#2dd4bf", secondary: "#0d9488", glow: "rgba(45,212,191,0.35)" },
];

const EMOJIS = [
  "📚",
  "⚛️",
  "🧪",
  "∑",
  "🌍",
  "📊",
  "🧠",
  "💻",
  "🎨",
  "🔬",
  "📝",
  "🏛️",
  "🌱",
  "⚡",
  "🎵",
  "🏔️",
];

export default function NewNotebookModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const [emoji, setEmoji] = useState("📚");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const c = COLORS[colorIdx];

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    setLoading(true);
    try {
      await onAdd({
        title: title.trim(),
        subject: subject.trim(),
        icon_color: c.primary,
        emoji,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "26px",
          padding: "38px",
          background: "rgba(6,9,20,0.97)",
          backdropFilter: "blur(48px)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
        }}
      >
        <style>{`
          .modal-input::placeholder { color: rgba(200,230,255,0.2); }
          .modal-input:focus { outline: none; border-color: rgba(34,211,238,0.35) !important; }
          .emoji-pick:hover { background: rgba(255,255,255,0.12) !important; transform: scale(1.1); }
        `}</style>

        <h2
          style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 800,
            fontSize: "26px",
            color: "#fff",
            marginBottom: "6px",
          }}
        >
          New Notebook
        </h2>
        <p
          style={{
            color: "rgba(150,200,255,0.4)",
            fontSize: "14px",
            marginBottom: "28px",
          }}
        >
          Create a new workspace for your course
        </p>

        {error && (
          <div
            style={{
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: "12px",
              padding: "12px 16px",
              color: "#fca5a5",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* Title */}
        <label
          style={{
            color: `${c.primary}88`,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Title
        </label>
        <input
          className="modal-input"
          placeholder="e.g. Quantum Mechanics"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          autoFocus
          style={{
            width: "100%",
            padding: "13px 16px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#fff",
            fontSize: "15px",
            marginBottom: "16px",
            fontFamily: "'DM Sans',sans-serif",
            transition: "border-color 0.2s",
          }}
        />

        {/* Subject */}
        <label
          style={{
            color: `${c.primary}88`,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Subject
        </label>
        <input
          className="modal-input"
          placeholder="e.g. Physics"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{
            width: "100%",
            padding: "13px 16px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#fff",
            fontSize: "15px",
            marginBottom: "22px",
            fontFamily: "'DM Sans',sans-serif",
            transition: "border-color 0.2s",
          }}
        />

        {/* Emoji */}
        <label
          style={{
            color: `${c.primary}88`,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "10px",
          }}
        >
          Emoji
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8,1fr)",
            gap: "8px",
            marginBottom: "22px",
            padding: "14px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {EMOJIS.map((em, i) => (
            <button
              key={i}
              className="emoji-pick"
              onClick={() => setEmoji(em)}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                fontSize: "22px",
                background:
                  emoji === em ? `${c.primary}22` : "rgba(255,255,255,0.05)",
                border:
                  emoji === em
                    ? `2px solid ${c.primary}66`
                    : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: emoji === em ? `0 0 12px ${c.glow}` : "none",
              }}
            >
              {em}
            </button>
          ))}
        </div>

        {/* Accent color */}
        <label
          style={{
            color: `${c.primary}88`,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "12px",
          }}
        >
          Accent Color
        </label>
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          {COLORS.map((col, i) => (
            <div
              key={i}
              onClick={() => setColorIdx(i)}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${col.primary}, ${col.secondary})`,
                cursor: "pointer",
                transition: "all 0.2s",
                border:
                  colorIdx === i ? "3px solid #fff" : "3px solid transparent",
                boxShadow: colorIdx === i ? `0 0 20px ${col.glow}` : "none",
                transform: colorIdx === i ? "scale(1.18)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {/* Preview */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "14px 18px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${c.primary}22`,
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "12px",
              background: `${c.primary}18`,
              border: `1px solid ${c.primary}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
            }}
          >
            {emoji}
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>
              {title || "Notebook Title"}
            </p>
            <p style={{ color: c.primary, fontSize: "12px", marginTop: "2px" }}>
              {subject || "No subject"} · 0 sections
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(200,220,255,0.5)",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "14px",
              background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
              border: "none",
              color: "#000",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              boxShadow: `0 0 40px ${c.glow}`,
              transition: "all 0.2s",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Creating..." : "Create Notebook"}
          </button>
        </div>
      </div>
    </div>
  );
}
