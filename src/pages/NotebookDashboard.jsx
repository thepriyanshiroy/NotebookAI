import { useEffect, useMemo, useState } from "react";
import { createNotebook, deleteNotebook, getNotebooks } from "../lib/database";
import AppLayout from "../components/layout/AppLayout";
import NotebookCard from "../components/dashboard/NotebookCard";
import NewNotebookModal from "../components/dashboard/NewNotebookModal";

export default function NotebookDashboard() {
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchNotebooks = async () => {
      try {
        const data = await getNotebooks();
        setNotebooks(data || []);
      } catch (err) {
        console.error("Failed to load notebooks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotebooks();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return notebooks;
    return notebooks.filter(
      (notebook) =>
        notebook.title.toLowerCase().includes(term) ||
        (notebook.subject || "").toLowerCase().includes(term),
    );
  }, [notebooks, search]);

  const handleAdd = async ({ title, subject, icon_color, emoji }) => {
    const notebook = await createNotebook({ title, subject, icon_color, emoji });
    setNotebooks((prev) => [notebook, ...prev]);
  };

  const handleDelete = async (id) => {
    await deleteNotebook(id);
    setNotebooks((prev) => prev.filter((notebook) => notebook.id !== id));
  };

  return (
    <AppLayout
      notebookCount={notebooks.length}
      search={search}
      setSearch={setSearch}
      searchPlaceholder="Search notebooks"
    >
      <div className="page-scroll" aria-label="Notebooks">
        <div className="page-stack">
          <section className="page-header">
            <div>
              <p className="page-eyebrow">Library</p>
              <h1 className="page-title">Notebooks</h1>
              <p className="page-subtitle">
                Create focused spaces for courses, projects, and revision notes.
              </p>
            </div>
            <button
              className="primary-action"
              onClick={() => setShowModal(true)}
              type="button"
            >
              New notebook
            </button>
          </section>

          <section className="surface-panel">
            <div className="panel-header">
              <h2>
                {filtered.length} notebook{filtered.length === 1 ? "" : "s"}
              </h2>
              {search && (
                <button
                  className="ghost-action"
                  type="button"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </button>
              )}
            </div>
            <div className="panel-body">
              {loading && <div className="spinner" aria-label="Loading" />}

              {!loading && notebooks.length === 0 && (
                <div className="empty-panel">
                  <div>
                    <p>No notebooks yet.</p>
                    <button
                      className="primary-action"
                      type="button"
                      onClick={() => setShowModal(true)}
                    >
                      Create your first notebook
                    </button>
                  </div>
                </div>
              )}

              {!loading && notebooks.length > 0 && filtered.length === 0 && (
                <div className="empty-panel">No notebooks match "{search}".</div>
              )}

              {!loading && filtered.length > 0 && (
                <div className="notebooks-grid">
                  {filtered.map((notebook) => (
                    <NotebookCard
                      key={notebook.id}
                      notebook={notebook}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
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
