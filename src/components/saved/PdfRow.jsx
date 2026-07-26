const formatSize = (b) => {
  if (!b) return "-";
  return b < 1048576
    ? (b / 1024).toFixed(0) + " KB"
    : (b / 1048576).toFixed(1) + " MB";
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

export default function PdfRow({ pdf, onPreview, onSummarize, onDelete }) {
  return (
    <div
      className="pdf-row"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px 20px",
        borderRadius: "14px",
        marginBottom: "8px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "11px",
          flexShrink: 0,
          background: "rgba(232,121,160,0.12)",
          border: "1.5px solid rgba(232,121,160,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#e879a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14 2 14 8 20 8" stroke="#e879a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="16" y1="13" x2="8" y2="13" stroke="#e879a0" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="16" y1="17" x2="8" y2="17" stroke="#e879a0" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        <p
          style={{
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            margin: "0 0 4px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {pdf.name}
        </p>
        <p style={{ color: "rgba(150,200,255,0.4)", fontSize: "12px", margin: 0 }}>
          {formatSize(pdf.size_bytes)} - Added {formatDate(pdf.created_at)}
        </p>
      </div>

      <div className="pdf-actions" style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        {pdf.summary ? (
          <button
            onClick={() => onSummarize(pdf)}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 13px",
              borderRadius: "9px",
              background: "rgba(34,211,238,0.1)",
              border: "1px solid rgba(34,211,238,0.3)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ color: "#22d3ee", fontSize: "12px", fontWeight: 600 }}>
              Summary
            </span>
          </button>
        ) : (
          <button
            onClick={() => onSummarize(pdf)}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 13px",
              borderRadius: "9px",
              background: "transparent",
              border: "1px solid rgba(249,115,22,0.35)",
              color: "#f97316",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Summarize
          </button>
        )}

        <button
          onClick={() => onPreview(pdf)}
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 13px",
            borderRadius: "9px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(180,220,255,0.55)",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.15s",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
          Preview
        </button>

        <button
          onClick={() => onDelete(pdf)}
          type="button"
          aria-label={`Delete ${pdf.name}`}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.25)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
