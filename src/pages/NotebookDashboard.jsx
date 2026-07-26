import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getNotebooks, createNotebook, deleteNotebook } from "../lib/database";
import { supabase } from "../lib/supabase";
import AppLayout from "../components/layout/AppLayout";
import NotebookCard from "../components/dashboard/NotebookCard";
import NewNotebookModal from "../components/dashboard/NewNotebookModal";

export default function NotebookDashboard() {
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [pdfStats, setPdfStats] = useState({ total: 0, summarized: 0 });
  const [savedPdfs, setSavedPdfs] = useState([]);
  const [sections, setSections] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const isNotebookScreen = location.pathname === "/notebooks";
  const isDashboard = location.pathname === "/dashboard";

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  useEffect(() => {
    fetchNotebooks();
    fetchPdfStats();
  }, []);

  const fetchPdfStats = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("saved_pdfs")
        .select("id,name,summary")
        .eq("user_id", user.id);

      if (!error && data) {
        setSavedPdfs(data);
        setPdfStats({
          total: data.length,
          summarized: data.filter((d) => d.summary).length,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotebooks = async () => {
    try {
      setLoading(true);
      const data = await getNotebooks();
      setNotebooks(data || []);
      const notebookIds = (data || []).map((notebook) => notebook.id);
      if (notebookIds.length === 0) {
        setSections([]);
      } else {
        const { data: sectionData, error } = await supabase
          .from("sections")
          .select("id,title,notebook_id")
          .in("notebook_id", notebookIds);
        if (!error) setSections(sectionData || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async ({ title, subject, icon_color, emoji }) => {
    const nb = await createNotebook({ title, subject, icon_color, emoji });
    setNotebooks((prev) => [nb, ...prev]);
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteNotebook(deleteConfirmId);
    setNotebooks((prev) => prev.filter((n) => n.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  const filtered = notebooks.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.subject || "").toLowerCase().includes(search.toLowerCase()),
  );

  const query = search.trim().toLowerCase();
  const workspaceResults =
    isDashboard && query
      ? [
          ...notebooks
            .filter(
              (notebook) =>
                notebook.title.toLowerCase().includes(query) ||
                (notebook.subject || "").toLowerCase().includes(query),
            )
            .map((notebook) => ({
              id: `notebook-${notebook.id}`,
              icon: "NB",
              type: "Notebook",
              title: notebook.title,
              detail: notebook.subject || "Notebook",
              onSelect: () => navigate(`/notebook/${notebook.id}`),
            })),
          ...sections
            .filter((section) => (section.title || "").toLowerCase().includes(query))
            .map((section) => {
              const parent = notebooks.find((notebook) => notebook.id === section.notebook_id);
              return {
                id: `section-${section.id}`,
                icon: "SC",
                type: "Section",
                title: section.title || "Untitled section",
                detail: parent?.title || "Notebook section",
                onSelect: () => navigate(`/notebook/${section.notebook_id}`),
              };
            }),
          ...savedPdfs
            .filter((pdf) => (pdf.name || "").toLowerCase().includes(query))
            .map((pdf) => ({
              id: `pdf-${pdf.id}`,
              icon: "PDF",
              type: "Saved PDF",
              title: pdf.name,
              detail: "Saved PDFs",
              onSelect: () =>
                navigate("/saved", { state: { search: pdf.name, previewPdfId: pdf.id } }),
            })),
          ...savedPdfs
            .filter(
              (pdf) =>
                pdf.summary &&
                ((pdf.name || "").toLowerCase().includes(query) ||
                  (pdf.summary || "").toLowerCase().includes(query)),
            )
            .map((pdf) => ({
              id: `summary-${pdf.id}`,
              icon: "AI",
              type: "AI Summary",
              title: `${pdf.name} summary`,
              detail: "Generated summary",
              onSelect: () =>
                navigate("/saved", { state: { search: pdf.name, summaryPdfId: pdf.id } }),
            })),
        ].slice(0, 10)
      : [];

  const totalNotebooks = notebooks.length;
  const totalSections = notebooks.reduce((sum, nb) => {
    return sum + Number(nb.sections?.[0]?.count ?? 0);
  }, 0);

  const STATS = [
    {
      label: "Total\nNotebooks",
      value: String(totalNotebooks),
      color: "#22d3ee",
      glow: "rgba(34,211,238,0.4)",
    },
    {
      label: "Total\nSections",
      value: String(totalSections),
      color: "#e879a0",
      glow: "rgba(232,121,160,0.4)",
    },
    {
      label: "Saved\nPDFs",
      value: String(pdfStats.total),
      color: "#2dd4bf",
      glow: "rgba(45,212,191,0.4)",
    },
    {
      label: "AI\nSummaries",
      value: String(pdfStats.summarized),
      color: "#f97316",
      glow: "rgba(249,115,22,0.4)",
    },
  ];

  return (
    <AppLayout notebookCount={notebooks.length} search={search} setSearch={setSearch}>
      <div
        style={{ flex: 1, overflowY: "auto", padding: "44px 56px" }}
        className={`dashboard-content ${isNotebookScreen ? "mobile-notebook-screen" : "mobile-dashboard-screen"} ${
          isDashboard && search.trim() ? "search-active" : ""
        }`}
      >
        <div
          className="f1 header-section"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "16px",
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
              Notebooks
            </h1>
            <p
              style={{
                color: "rgba(150,200,255,0.4)",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {notebooks.length} notebook{notebooks.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "linear-gradient(135deg, #22d3ee, #06b6d4)",
              color: "#000",
              border: "none",
              borderRadius: "16px",
              padding: "15px 32px",
              fontWeight: 700,
              fontSize: "16px",
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              boxShadow:
                "0 0 40px rgba(34,211,238,0.6), 0 4px 20px rgba(0,0,0,0.35)",
              flexShrink: 0,
              letterSpacing: "0.01em",
              transition: "box-shadow 0.2s",
            }}
          >
            <span style={{ fontSize: "22px", lineHeight: 1 }}>+</span>
            New Notebook
          </button>
        </div>

        <div
          className="f2 stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "16px",
            marginBottom: "44px",
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="stat-card"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
                padding: "26px 28px",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.2)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: "44px",
                  color: s.color,
                  lineHeight: 1,
                  marginBottom: "8px",
                  textShadow: `0 0 40px ${s.glow}`,
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  color: "rgba(180,220,255,0.45)",
                  fontSize: "13px",
                  fontWeight: 500,
                  whiteSpace: "pre-line",
                  lineHeight: 1.4,
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {isDashboard && search.trim() && (
          <div
            className="workspace-search-results"
            style={{
              marginTop: "10px",
              marginBottom: "32px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              overflow: "hidden",
              backdropFilter: "blur(24px)",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                color: "rgba(220,240,255,0.7)",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              Workspace results
            </div>
            {workspaceResults.length === 0 ? (
              <p
                style={{
                  margin: 0,
                  padding: "18px",
                  color: "rgba(150,200,255,0.4)",
                  fontSize: "14px",
                }}
              >
                No workspace results for "{search}".
              </p>
            ) : (
              <div style={{ display: "grid", gap: "1px", background: "rgba(255,255,255,0.04)" }}>
                {workspaceResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={result.onSelect}
                    className="workspace-search-result"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      width: "100%",
                      padding: "13px 16px",
                      border: "none",
                      background: "rgba(6,9,20,0.94)",
                      color: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        background: "rgba(34,211,238,0.1)",
                        border: "1px solid rgba(34,211,238,0.22)",
                        color: "#22d3ee",
                        fontSize: "11px",
                        fontWeight: 800,
                      }}
                    >
                      {result.icon}
                    </span>
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <span
                        style={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "14px",
                          fontWeight: 700,
                        }}
                      >
                        {result.title}
                      </span>
                      <span style={{ color: "rgba(150,200,255,0.4)", fontSize: "12px" }}>
                        {result.type} - {result.detail}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "220px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                border: "3px solid rgba(34,211,238,0.15)",
                borderTop: "3px solid #22d3ee",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          </div>
        )}

        {!loading && notebooks.length > 0 && (
          <div
            className="f3 notebooks-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: "20px",
            }}
          >
            {filtered.map((nb) => (
              <NotebookCard key={nb.id} notebook={nb} onDelete={handleDelete} />
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0" }}>
                <p style={{ color: "rgba(150,200,255,0.35)", fontSize: "16px" }}>
                  No notebooks match <span style={{ color: "#22d3ee" }}>"{search}"</span>
                </p>
              </div>
            )}
          </div>
        )}

        {!loading && notebooks.length === 0 && (
          <div
            className="f4 empty-state"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "280px",
              gap: "18px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "22px",
                background: "rgba(34,211,238,0.07)",
                border: "1px solid rgba(34,211,238,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: 800,
                color: "#22d3ee",
                boxShadow: "0 0 32px rgba(34,211,238,0.1)",
              }}
            >
              NB
            </div>
            <div>
              <p
                style={{
                  color: "rgba(220,240,255,0.65)",
                  fontSize: "20px",
                  fontWeight: 700,
                  fontFamily: "'Syne',sans-serif",
                  marginBottom: "8px",
                }}
              >
                No notebooks yet
              </p>
              <p style={{ color: "rgba(150,200,255,0.35)", fontSize: "14px" }}>
                Create your first notebook to start organising your studies
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              type="button"
              style={{
                background: "linear-gradient(135deg, #22d3ee, #06b6d4)",
                color: "#000",
                border: "none",
                borderRadius: "12px",
                padding: "13px 30px",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                boxShadow: "0 0 28px rgba(34,211,238,0.45)",
                marginTop: "4px",
              }}
            >
              + Create your first notebook
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <NewNotebookModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}

      {deleteConfirmId && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirmId(null)} role="presentation">
          <div 
            className="modal-panel" 
            role="dialog"
            onClick={(e) => e.stopPropagation()} 
            style={{ width: "min(400px, 90vw)", textAlign: "center", padding: "32px 24px" }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(239,68,68,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ color: "#fff", marginBottom: "12px", fontSize: "20px", fontFamily: "'Syne', sans-serif" }}>Delete Notebook?</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "28px" }}>
              Are you sure you want to delete this notebook? All its sections and notes will be permanently lost.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button 
                className="ghost-action" 
                onClick={() => setDeleteConfirmId(null)}
                style={{ flex: 1, padding: "12px" }}
              >
                Cancel
              </button>
              <button 
                className="primary-action" 
                onClick={confirmDelete}
                style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #ef4444, #dc2626)", boxShadow: "0 0 20px rgba(239,68,68,0.3)" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
