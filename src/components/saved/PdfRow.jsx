const formatSize = (bytes) => {
  if (!bytes) return "-";
  return bytes < 1048576
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / 1048576).toFixed(1)} MB`;
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

function FileIcon() {
  return (
    <span className="pdf-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8M8 17h8" />
      </svg>
    </span>
  );
}

export default function PdfRow({
  pdf,
  onPreview,
  onSummarize,
  onDelete,
  compact = false,
}) {
  return (
    <article className={`pdf-row ${compact ? "compact" : ""}`}>
      <FileIcon />
      <div className="pdf-main">
        <h3>{pdf.name}</h3>
        <p>
          {formatSize(pdf.size_bytes)} - Added {formatDate(pdf.created_at)}
        </p>
      </div>

      {!compact && (
        <div className="pdf-actions">
          <button
            className={pdf.summary ? "secondary-action" : "ghost-action"}
            onClick={() => onSummarize(pdf)}
            type="button"
          >
            {pdf.summary ? "Summary" : "Summarize"}
          </button>
          <button
            className="ghost-action"
            onClick={() => onPreview(pdf)}
            type="button"
          >
            Preview
          </button>
          <button
            className="delete-icon-button"
            onClick={() => onDelete(pdf)}
            type="button"
            aria-label={`Delete ${pdf.name}`}
          >
            <svg viewBox="0 0 24 24" className="small-icon" aria-hidden="true">
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="m19 6-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        </div>
      )}
    </article>
  );
}
