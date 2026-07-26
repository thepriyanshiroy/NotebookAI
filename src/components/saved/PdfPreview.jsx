export default function PdfPreview({ pdf, splitMode, onClose, onSummarize }) {
  return (
    <div
      className="pdf-preview-pane"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "rgba(3,4,14,0.92)",
        borderRight: splitMode ? "1px solid rgba(255,255,255,0.07)" : "none",
      }}
    >
      {/* Topbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          height: "52px",
          flexShrink: 0,
          background: "rgba(4,5,16,0.95)",
          backdropFilter: "blur(40px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!splitMode && (
            <button
              onClick={onClose}
              aria-label="Back to PDF list"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.4)",
                fontSize: "18px",
                padding: "4px 8px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
              }
            >
              ←
            </button>
          )}
          <span
            style={{
              color: "#fff",
              fontSize: splitMode ? "13px" : "14px",
              fontWeight: 600,
            }}
          >
            {splitMode ? "Preview" : pdf.name}
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* AI Summary button — only in non-split mode */}
          {!splitMode && onSummarize && (
            <button
              onClick={() => onSummarize(pdf)}
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 18px",
                borderRadius: "10px",
                background: "rgba(249,115,22,0.12)",
                border: "1px solid rgba(249,115,22,0.35)",
                color: "#f97316",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(249,115,22,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(249,115,22,0.12)")
              }
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              AI Summary
            </button>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            type="button"
            aria-label="Close PDF preview"
            style={{
              width: splitMode ? "30px" : "34px",
              height: splitMode ? "30px" : "34px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* PDF iframe */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <iframe
          src={pdf.url}
          style={{ width: "100%", height: "100%", border: "none" }}
          title={pdf.name}
        />
      </div>
    </div>
  );
}
