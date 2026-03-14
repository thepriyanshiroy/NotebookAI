import { useState } from "react";

export default function SectionsPanel({
  notebook,
  sections,
  setSections,
  activeId,
  setActiveId,
  loading,
  onAdd,
  onDelete,
  onRename,
  onClose,
}) {
  const [editingId, setEditingId] = useState(null);

  const handleBlur = (s) => {
    setEditingId(null);
    onRename(s.id, s.title);
  };

  return (
    <div
      style={{
        width: "280px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "rgba(5,7,18,0.95)",
        backdropFilter: "blur(40px)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Notebook name header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 18px",
          flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9px",
              flexShrink: 0,
              background: "rgba(34,211,238,0.12)",
              border: "1.5px solid rgba(34,211,238,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
            }}
          >
            {notebook?.emoji || "📚"}
          </div>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              color: "#fff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {notebook?.title || "..."}
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.3)",
            fontSize: "20px",
            lineHeight: 1,
            padding: "2px 6px",
            borderRadius: "6px",
            transition: "color 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
          }
        >
          ×
        </button>
      </div>

      {/* Loading spinner */}
      {loading && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              border: "2px solid rgba(34,211,238,0.2)",
              borderTop: "2px solid #22d3ee",
              animation: "spin 0.8s linear infinite",
            }}
          />
        </div>
      )}

      {/* Section list */}
      {!loading && (
        <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
          {sections.length === 0 && (
            <p
              style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: "13px",
                textAlign: "center",
                marginTop: "32px",
              }}
            >
              No sections yet
            </p>
          )}

          {sections.map((s) => {
            const isActive = activeId === s.id;
            return (
              <div
                key={s.id}
                className="sec-item"
                onClick={() => setActiveId(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "11px 12px",
                  borderRadius: "12px",
                  marginBottom: "3px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(34,211,238,0.14), rgba(34,211,238,0.05))"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(34,211,238,0.3)"
                    : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    stroke={isActive ? "#22d3ee" : "rgba(255,255,255,0.28)"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="14 2 14 8 20 8"
                    stroke={isActive ? "#22d3ee" : "rgba(255,255,255,0.28)"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {editingId === s.id ? (
                  <input
                    autoFocus
                    value={s.title}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      setSections((prev) =>
                        prev.map((sec) =>
                          sec.id === s.id
                            ? { ...sec, title: e.target.value }
                            : sec,
                        ),
                      )
                    }
                    onBlur={() => handleBlur(s)}
                    onKeyDown={(e) => e.key === "Enter" && handleBlur(s)}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      fontWeight: 500,
                    }}
                  />
                ) : (
                  <span
                    style={{
                      flex: 1,
                      fontSize: "13px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.48)",
                      fontWeight: isActive ? 600 : 400,
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingId(s.id);
                    }}
                  >
                    {s.title}
                  </span>
                )}

                <button
                  className="del-btn"
                  onClick={(e) => onDelete(s.id, e)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.2)",
                    fontSize: "16px",
                    lineHeight: 1,
                    opacity: 0,
                    transition: "all 0.15s",
                    flexShrink: 0,
                    padding: "2px 5px",
                    borderRadius: "5px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f87171";
                    e.currentTarget.style.background = "rgba(248,113,113,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.background = "none";
                  }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Section */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onAdd}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 14px",
            borderRadius: "12px",
            background: "transparent",
            border: "1.5px solid rgba(34,211,238,0.25)",
            color: "rgba(34,211,238,0.65)",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(34,211,238,0.08)";
            e.currentTarget.style.borderColor = "rgba(34,211,238,0.55)";
            e.currentTarget.style.color = "#22d3ee";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(34,211,238,0.25)";
            e.currentTarget.style.color = "rgba(34,211,238,0.65)";
          }}
        >
          <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span>
          Add Section
        </button>
      </div>
    </div>
  );
}
