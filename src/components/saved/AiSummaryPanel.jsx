export default function AiSummaryPanel({ summarizing, aiText, onClose }) {
  return (
    <div
      className="ai-summary-pane"
      style={{
        width: "380px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "rgba(4,5,16,0.96)",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "0 24px",
          height: "52px",
          flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <button
          className="mobile-summary-back"
          onClick={onClose}
          aria-label="Back to PDF list"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.5)",
            fontSize: "18px",
            padding: "4px 8px 4px 0",
            display: "none",
          }}
        >
          ←
        </button>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{ color: "#fff", fontSize: "13px", fontWeight: 700, flex: 1 }}
        >
          AI Summary
        </span>
      </div>

      {/* Content */}
      <div
        className="ai-summary-content"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Loading shimmer */}
        {summarizing && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {[100, 85, 92, 78, 88, 70, 95, 80].map((w, i) => (
              <div
                key={i}
                style={{
                  width: w + "%",
                  height: "10px",
                  borderRadius: "5px",
                  background: "rgba(249,115,22,0.12)",
                  animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
            <p
              style={{
                color: "rgba(249,115,22,0.5)",
                fontSize: "12px",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              Generating summary...
            </p>
          </div>
        )}

        {/* Summary text */}
        {!summarizing && aiText && (
          <div>
            {aiText
              .split("\n\n")
              .filter(Boolean)
              .map((para, i) => {
                const isQuote = para.startsWith("> ");
                const text = isQuote ? para.slice(2) : para;
                
                return (
                  <p
                    key={i}
                    style={{
                      color: isQuote ? "#f97316" : "rgba(215,230,255,0.82)",
                      background: isQuote ? "rgba(249,115,22,0.1)" : "transparent",
                      borderLeft: isQuote ? "3px solid #f97316" : "none",
                      padding: isQuote ? "10px 14px" : "0",
                      borderRadius: isQuote ? "0 8px 8px 0" : "0",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      marginBottom: "12px",
                    }}
                  >
                    {text.split("**").map((chunk, j) =>
                      j % 2 === 1 ? (
                        <strong
                          key={j}
                          style={{ color: isQuote ? "#f97316" : "#fff", fontWeight: 700 }}
                        >
                          {chunk}
                        </strong>
                      ) : (
                        chunk
                      ),
                    )}
                  </p>
                );
              })}

            <button
              onClick={onClose}
              type="button"
              style={{
                marginTop: "12px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "linear-gradient(135deg,#f97316,#ea580c)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "10px 20px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 0 20px rgba(249,115,22,0.25)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="17 21 17 13 7 13 7 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Save & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
