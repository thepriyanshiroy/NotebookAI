import PdfRow from "./PdfRow";

export default function PdfList({
  pdfs,
  loading,
  uploading,
  onUpload,
  onPreview,
  onSummarize,
  onDelete,
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        className="pdf-list-header"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "32px 44px 24px",
          flexShrink: 0,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "36px",
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Saved PDFs
          </h1>
          <p
            style={{
              color: "rgba(150,200,255,0.4)",
              fontSize: "13px",
              margin: "6px 0 0",
            }}
          >
            {pdfs.length} document{pdfs.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={onUpload}
          disabled={uploading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: uploading
              ? "rgba(34,211,238,0.4)"
              : "linear-gradient(135deg,#22d3ee,#06b6d4)",
            color: "#000",
            border: "none",
            borderRadius: "13px",
            padding: "12px 22px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: uploading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            boxShadow: "0 0 28px rgba(34,211,238,0.35)",
          }}
        >
          {uploading ? (
            <>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  border: "2px solid rgba(0,0,0,0.3)",
                  borderTop: "2px solid #000",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Uploading...
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="17 8 12 3 7 8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="3"
                  x2="12"
                  y2="15"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              Upload PDF
            </>
          )}
        </button>
      </div>

      {/* List */}
      <div className="pdf-list-content" style={{ flex: 1, overflowY: "auto", padding: "0 44px 32px" }}>
        {/* Loading spinner */}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "60px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                border: "2px solid rgba(34,211,238,0.2)",
                borderTop: "2px solid #22d3ee",
                animation: "spin 0.8s linear infinite",
              }}
            />
          </div>
        )}

        {/* Empty state */}
        {!loading && pdfs.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "300px",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "16px",
                background: "rgba(34,211,238,0.08)",
                border: "1.5px solid rgba(34,211,238,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  stroke="rgba(34,211,238,0.5)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="14 2 14 8 20 8"
                  stroke="rgba(34,211,238,0.5)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "15px",
                margin: 0,
              }}
            >
              No PDFs saved yet
            </p>
            <button
              onClick={onUpload}
              style={{
                background: "linear-gradient(135deg,#22d3ee,#06b6d4)",
                color: "#000",
                border: "none",
                borderRadius: "12px",
                padding: "11px 24px",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Upload your first PDF
            </button>
          </div>
        )}

        {/* PDF rows */}
        {pdfs.map((pdf) => (
          <PdfRow
            key={pdf.id}
            pdf={pdf}
            onPreview={onPreview}
            onSummarize={onSummarize}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
