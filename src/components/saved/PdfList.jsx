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
    <div className="page-scroll" aria-label="Saved PDF library">
      <div className="page-stack">
        <section className="page-header">
          <div>
            <p className="page-eyebrow">Documents</p>
            <h1 className="page-title">Saved PDFs</h1>
            <p className="page-subtitle">
              Upload readings, preview documents, and generate AI study guides.
            </p>
          </div>
          <button
            className="primary-action"
            onClick={onUpload}
            disabled={uploading}
            type="button"
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </section>

        <section className="surface-panel">
          <div className="panel-header">
            <h2>
              {pdfs.length} document{pdfs.length === 1 ? "" : "s"}
            </h2>
          </div>

          <div className="panel-body compact-list">
            {loading && <div className="spinner" aria-label="Loading" />}

            {!loading && pdfs.length === 0 && (
              <div className="empty-panel">
                <div>
                  <p>No PDFs saved yet.</p>
                  <button
                    className="primary-action"
                    onClick={onUpload}
                    type="button"
                  >
                    Upload your first PDF
                  </button>
                </div>
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
        </section>
      </div>
    </div>
  );
}
