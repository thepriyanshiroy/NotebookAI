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
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        className="f1 header-section pdf-list-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "44px 56px",
          marginBottom: "0px",
          flexWrap: "wrap",
          gap: "16px",
          flexShrink: 0,
        }}
      >
        <div>
          <p
            style={{
              color: "rgba(34,211,238,0.55)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            {greeting}
          </p>
          <h1
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "48px",
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              textShadow: "0 0 80px rgba(34,211,238,0.18)",
              marginBottom: "8px",
            }}
          >
            PDFs
          </h1>
          <p
            style={{
              color: "rgba(150,200,255,0.4)",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {pdfs.length} document{pdfs.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={onUpload}
          disabled={uploading}
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: uploading
              ? "rgba(34,211,238,0.4)"
              : "linear-gradient(135deg, #22d3ee, #06b6d4)",
            color: "#000",
            border: "none",
            borderRadius: "16px",
            padding: "15px 32px",
            fontWeight: 700,
            fontSize: "16px",
            cursor: uploading ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans',sans-serif",
            boxShadow: uploading 
              ? "none" 
              : "0 0 40px rgba(34,211,238,0.6), 0 4px 20px rgba(0,0,0,0.35)",
            flexShrink: 0,
            letterSpacing: "0.01em",
            transition: "box-shadow 0.2s",
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
              <span style={{ fontSize: "22px", lineHeight: 1 }}>+</span>
              Upload PDF
            </>
          )}
        </button>
      </div>

      <div className="pdf-list-content" style={{ flex: 1, overflowY: "auto", padding: "0 44px 32px" }}>
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "60px" }}>
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="rgba(34,211,238,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="14 2 14 8 20 8" stroke="rgba(34,211,238,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "15px", margin: 0 }}>
              No PDFs saved yet
            </p>
            <button
              onClick={onUpload}
              type="button"
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
