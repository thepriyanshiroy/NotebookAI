import RichTextEditor from "./RichTextEditor";

export default function EditorPanel({
  active,
  onTitleChange,
  onContentChange,
  onAddSection,
}) {
  if (!active) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          background: "rgba(3,4,14,0.88)",
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "15px" }}>
          No sections yet
        </p>
        <button
          onClick={onAddSection}
          style={{
            background: "linear-gradient(135deg, #22d3ee, #06b6d4)",
            color: "#000",
            border: "none",
            borderRadius: "12px",
            padding: "12px 28px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 0 28px rgba(34,211,238,0.45)",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          + Add your first section
        </button>
      </div>
    );
  }

  const content = active.content || "";
  // Strip HTML for word and char count
  const plainText = content.replace(/<[^>]*>?/gm, "");
  const charCount = plainText.length;
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "rgba(3,4,14,0.88)",
        overflow: "hidden",
      }}
    >
      {/* Section title */}
      <div className="editor-title-row" style={{ padding: "36px 52px 20px" }}>
        <input
          value={active.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Section title..."
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "36px",
            color: "#fff",
            background: "transparent",
            border: "none",
            width: "100%",
            letterSpacing: "-0.02em",
          }}
        />
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.07)",
          margin: "0 52px 4px",
        }}
      />

      {/* Content */}
      <RichTextEditor
        content={content}
        onChange={onContentChange}
      />

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 52px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>
          {charCount} characters · {wordCount} words
        </span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>
          Double-click section name to rename · Auto-saves after 1.5s
        </span>
      </div>
    </div>
  );
}
