export default function PdfPreview({ pdf, splitMode, onClose, onSummarize }) {
  return (
    <div
      className={`pdf-preview-pane ${splitMode ? "split-mode" : "fullscreen-mode"}`}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "rgba(3,4,14,0.92)",
        borderRight: splitMode ? "1px solid rgba(255,255,255,0.07)" : "none",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
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
          {/* Download button */}
          <a
            href={pdf.url}
            download={pdf.name}
            target="_blank"
            rel="noopener noreferrer"
            title="Download PDF"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "rgba(34,211,238,0.1)",
              border: "1px solid rgba(34,211,238,0.3)",
              color: "#22d3ee",
              cursor: "pointer",
              textDecoration: "none",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(34,211,238,0.18)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(34,211,238,0.1)")
            }
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
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
