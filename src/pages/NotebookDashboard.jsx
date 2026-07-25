import { useState, useEffect } from "react";
import { getNotebooks, createNotebook, deleteNotebook } from "../lib/database";
import { supabase } from "../lib/supabase";
import AppLayout from "../components/layout/AppLayout";
import NotebookCard from "../components/dashboard/NotebookCard";
import NewNotebookModal from "../components/dashboard/NewNotebookModal";
import bg from "../assets/background.jpg";

export default function NotebookDashboard() {
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const [pdfStats, setPdfStats] = useState({ total: 0, summarized: 0 });

  useEffect(() => {
    fetchNotebooks();
    fetchPdfStats();
  }, []);

  const fetchPdfStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('saved_pdfs')
        .select('summary')
        .eq('user_id', user.id);
        
      if (!error && data) {
        setPdfStats({
          total: data.length,
          summarized: data.filter(d => d.summary).length
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotebooks = async () => {
    try {
      const data = await getNotebooks();
      setNotebooks(data || []);
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

  const handleDelete = async (id) => {
    await deleteNotebook(id);
    setNotebooks((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notebooks.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.subject || "").toLowerCase().includes(search.toLowerCase()),
  );

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
      <div style={{ flex: 1, overflowY: "auto", padding: "44px 56px" }} className="dashboard-content">
        {/* Header */}
        <div
              className="f1 header-section"
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: "40px",
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
                  Your Notebooks
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
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 64px rgba(34,211,238,0.8), 0 4px 24px rgba(0,0,0,0.4)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 40px rgba(34,211,238,0.6), 0 4px 20px rgba(0,0,0,0.35)")
                }
              >
                <span style={{ fontSize: "22px", lineHeight: 1 }}>+</span>
                New Notebook
              </button>
            </div>

            {/* Stats */}
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = `1px solid ${s.color}33`;
                    e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.35), 0 0 32px ${s.glow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border =
                      "1px solid rgba(255,255,255,0.07)";
                    e.currentTarget.style.boxShadow =
                      "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.2)";
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

            {/* Loading */}
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

            {/* Grid */}
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
                  <NotebookCard
                    key={nb.id}
                    notebook={nb}
                    onDelete={handleDelete}
                  />
                ))}
                {filtered.length === 0 && (
                  <div
                    style={{
                      gridColumn: "1/-1",
                      textAlign: "center",
                      padding: "60px 0",
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(150,200,255,0.35)",
                        fontSize: "16px",
                      }}
                    >
                      No notebooks match{" "}
                      <span style={{ color: "#22d3ee" }}>"{search}"</span>
                    </p>
                  </div>
                )}
              </div>
            )}

      {/* Empty state */}
      {!loading && notebooks.length === 0 && (
        <div
          className="f4"
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
              fontSize: "38px",
              boxShadow: "0 0 32px rgba(34,211,238,0.1)",
            }}
          >
            📭
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
            <p
              style={{
                color: "rgba(150,200,255,0.35)",
                fontSize: "14px",
              }}
            >
              Create your first notebook to start organising your studies
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 0 44px rgba(34,211,238,0.65)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 0 28px rgba(34,211,238,0.45)")
            }
          >
            + Create your first notebook
          </button>
        </div>
      )}
      </div>

      {showModal && (
        <NewNotebookModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </AppLayout>
  );
}
