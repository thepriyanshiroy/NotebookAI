import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../lib/supabase";

function SummaryText({ text }) {
  return (
    <div className="summary-text">
      {text
        .split("\n\n")
        .filter(Boolean)
        .slice(0, 3)
        .map((para, index) => {
          const isNote = para.startsWith("> ");
          const clean = isNote ? para.slice(2) : para;
          return (
            <p className={isNote ? "summary-note" : ""} key={index}>
              {clean.split("**").map((chunk, chunkIndex) =>
                chunkIndex % 2 === 1 ? (
                  <strong key={chunkIndex}>{chunk}</strong>
                ) : (
                  chunk
                ),
              )}
            </p>
          );
        })}
    </div>
  );
}

export default function SummariesPage() {
  const [pdfs, setPdfs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from("saved_pdfs")
          .select("*")
          .eq("user_id", user.id)
          .not("summary", "is", null)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPdfs(data || []);
      } catch (err) {
        console.error("Failed to load summaries:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return pdfs;
    return pdfs.filter(
      (pdf) =>
        pdf.name.toLowerCase().includes(term) ||
        (pdf.summary || "").toLowerCase().includes(term),
    );
  }, [pdfs, search]);

  return (
    <AppLayout
      search={search}
      setSearch={setSearch}
      searchPlaceholder="Search summaries"
    >
      <div className="page-scroll" aria-label="AI summaries">
        <div className="page-stack">
          <section className="page-header">
            <div>
              <p className="page-eyebrow">Review</p>
              <h1 className="page-title">AI Summaries</h1>
              <p className="page-subtitle">
                Revisit generated study guides without opening every PDF again.
              </p>
            </div>
          </section>

          <section className="surface-panel">
            <div className="panel-header">
              <h2>
                {filtered.length} summar{filtered.length === 1 ? "y" : "ies"}
              </h2>
            </div>
            <div className="panel-body compact-list">
              {loading && <div className="spinner" aria-label="Loading" />}
              {!loading && pdfs.length === 0 && (
                <div className="empty-panel">
                  Generate a PDF summary from Saved PDFs to see it here.
                </div>
              )}
              {!loading && pdfs.length > 0 && filtered.length === 0 && (
                <div className="empty-panel">No summaries match "{search}".</div>
              )}
              {filtered.map((pdf) => (
                <article className="surface-panel" key={pdf.id}>
                  <div className="panel-header">
                    <div className="summary-main">
                      <h2>{pdf.name}</h2>
                      <p>Generated from Saved PDFs</p>
                    </div>
                  </div>
                  <div className="panel-body">
                    <SummaryText text={pdf.summary || ""} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
