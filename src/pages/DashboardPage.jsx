import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import NotebookCard from "../components/dashboard/NotebookCard";
import PdfRow from "../components/saved/PdfRow";
import { getNotebooks } from "../lib/database";
import { supabase } from "../lib/supabase";

const statColors = ["#22d3ee", "#e879a0", "#2dd4bf", "#f97316"];

function StatCard({ label, value, color }) {
  return (
    <article className="stat-card" style={{ "--stat-color": color }}>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </article>
  );
}

function QuickAction({ to, title, text }) {
  return (
    <Link className="summary-row" to={to}>
      <div className="summary-main">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <span className="secondary-action">Open</span>
    </Link>
  );
}

export default function DashboardPage() {
  const [notebooks, setNotebooks] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [notebookData, userRes] = await Promise.all([
          getNotebooks(),
          supabase.auth.getUser(),
        ]);

        setNotebooks(notebookData || []);

        const user = userRes.data?.user;
        if (user) {
          const { data, error } = await supabase
            .from("saved_pdfs")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5);

          if (!error) setPdfs(data || []);
        }
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const sections = notebooks.reduce(
      (sum, nb) => sum + Number(nb.sections?.[0]?.count ?? 0),
      0,
    );
    const summaries = pdfs.filter((pdf) => pdf.summary).length;

    return [
      ["Notebooks", notebooks.length],
      ["Sections", sections],
      ["Saved PDFs", pdfs.length],
      ["AI Summaries", summaries],
    ];
  }, [notebooks, pdfs]);

  const recentNotebooks = notebooks.slice(0, 4);
  const recentPdfs = pdfs.slice(0, 3);

  return (
    <AppLayout notebookCount={notebooks.length}>
      <div className="page-scroll" aria-label="Dashboard overview">
        <div className="page-stack">
          <section className="page-header">
            <div>
              <p className="page-eyebrow">Overview</p>
              <h1 className="page-title">Your study workspace</h1>
              <p className="page-subtitle">
                A compact view of your notebooks, PDFs, and generated summaries.
              </p>
            </div>
            <Link className="primary-action" to="/notebooks">
              New notebook
            </Link>
          </section>

          <section className="stats-grid" aria-label="Workspace statistics">
            {stats.map(([label, value], index) => (
              <StatCard
                key={label}
                label={label}
                value={loading ? "-" : String(value)}
                color={statColors[index]}
              />
            ))}
          </section>

          <section className="content-grid">
            <div className="surface-panel">
              <div className="panel-header">
                <h2>Recent notebooks</h2>
                <Link to="/notebooks">View all</Link>
              </div>
              <div className="panel-body">
                {loading && <div className="spinner" aria-label="Loading" />}
                {!loading && recentNotebooks.length === 0 && (
                  <div className="empty-panel">Create a notebook to begin.</div>
                )}
                {!loading && recentNotebooks.length > 0 && (
                  <div className="notebooks-grid">
                    {recentNotebooks.map((notebook) => (
                      <NotebookCard
                        key={notebook.id}
                        notebook={notebook}
                        compact
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="page-stack">
              <div className="surface-panel">
                <div className="panel-header">
                  <h2>Quick actions</h2>
                </div>
                <div className="panel-body compact-list">
                  <QuickAction
                    to="/notebooks"
                    title="Organize notebooks"
                    text="Search, create, and manage your study spaces."
                  />
                  <QuickAction
                    to="/saved"
                    title="Upload PDFs"
                    text="Save documents and open the preview workspace."
                  />
                  <QuickAction
                    to="/summaries"
                    title="Review summaries"
                    text="Return to your generated AI study guides."
                  />
                </div>
              </div>

              <div className="surface-panel">
                <div className="panel-header">
                  <h2>Recent PDFs</h2>
                  <Link to="/saved">View all</Link>
                </div>
                <div className="panel-body compact-list">
                  {!loading && recentPdfs.length === 0 && (
                    <div className="empty-panel">No PDFs saved yet.</div>
                  )}
                  {recentPdfs.map((pdf) => (
                    <PdfRow key={pdf.id} pdf={pdf} compact />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
