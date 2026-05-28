import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AppLayout from "../components/layout/AppLayout";
import SectionsPanel from "../components/editor/SectionsPanel";
import EditorPanel from "../components/editor/EditorPanel";

export default function NotebookEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notebook, setNotebook] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(true);
  const saveTimerRef = useRef(null);
  const [error, setError] = useState(null);

  const active = sections.find((s) => s.id === activeId) ?? null;

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const { data: nb, error: nbErr } = await supabase
          .from("notebooks")
          .select("*")
          .eq("id", id)
          .single();
        if (nbErr) {
          setError("Failed to load notebook: " + nbErr.message);
          return;
        }
        setNotebook(nb);

        const { data: secs, error: secsErr } = await supabase
          .from("sections")
          .select("*")
          .eq("notebook_id", id)
          .order("position", { ascending: true });
        if (secsErr) {
          setError("Failed to load sections: " + secsErr.message);
          return;
        }
        setSections(secs ?? []);
        if (secs?.length > 0) setActiveId(secs[0].id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const triggerAutosave = useCallback((sectionId, title, content) => {
    setSaved(false);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from("sections")
          .update({ title, content, updated_at: new Date().toISOString() })
          .eq("id", sectionId);
        if (error) throw error;
        setSaved(true);
      } catch (err) {
        console.error("Autosave error:", err);
      }
    }, 1500);
  }, []);

  const handleTitleChange = (val) => {
    if (!active) return;
    setSections((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, title: val } : s)),
    );
    triggerAutosave(activeId, val, active.content ?? "");
  };

  const handleContentChange = (val) => {
    if (!active) return;
    setSections((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, content: val } : s)),
    );
    triggerAutosave(activeId, active.title, val);
  };

  const handleSave = async () => {
    if (!active) return;
    try {
      const { error } = await supabase
        .from("sections")
        .update({
          title: active.title,
          content: active.content ?? "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", activeId);
      if (error) throw error;
      setSaved(true);
    } catch (err) {
      setError("Save failed: " + err.message);
    }
  };

  const handleAddSection = async () => {
    try {
      setError(null);
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr || !user) {
        setError("Not authenticated. Please log in again.");
        return;
      }

      const { data, error } = await supabase
        .from("sections")
        .insert([
          {
            notebook_id: id,
            user_id: user.id,
            title: "New Section",
            content: "",
            position: sections.length,
          },
        ])
        .select()
        .single();

      if (error) {
        setError("Failed to add section: " + error.message);
        return;
      }

      setSections((prev) => [...prev, data]);
      setActiveId(data.id);
      setSaved(false);

      await supabase
        .from("notebooks")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", id);
    } catch (err) {
      setError("Unexpected error: " + err.message);
    }
  };

  const handleDeleteSection = async (sectionId, e) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from("sections")
        .delete()
        .eq("id", sectionId);
      if (error) throw error;
      setSections((prev) => {
        const updated = prev.filter((s) => s.id !== sectionId);
        if (activeId === sectionId) setActiveId(updated[0]?.id ?? null);
        return updated;
      });
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  };

  const handleRename = async (sectionId, newTitle) => {
    try {
      const s = sections.find((sec) => sec.id === sectionId);
      if (!s) return;
      const { error } = await supabase
        .from("sections")
        .update({ title: newTitle, content: s.content ?? "" })
        .eq("id", sectionId);
      if (error) throw error;
    } catch (err) {
      console.error("Rename error:", err);
    }
  };

  return (
    <AppLayout notebookCount={null}>
      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.4)",
            borderRadius: "10px",
            padding: "10px 20px",
            margin: "10px 20px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#fca5a5", fontSize: "13px", fontWeight: 500 }}>
            ⚠️ {error}
          </span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              color: "#fca5a5",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Breadcrumb + Save bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          height: "52px",
          flexShrink: 0,
          background: "rgba(4,5,16,0.92)",
          backdropFilter: "blur(40px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              color: "#22d3ee",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {notebook?.title || "Notebook"}
          </button>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <polyline
              points="9 18 15 12 9 6"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>
            {active?.title || "—"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {saved && (
            <span
              style={{
                color: "#22d3ee",
                fontSize: "13px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <polyline
                  points="20 6 9 17 4 12"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Saved
            </span>
          )}
          <button
            onClick={handleSave}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: saved ? "transparent" : "#22d3ee",
              color: saved ? "#22d3ee" : "#000",
              border: "1.5px solid #22d3ee",
              borderRadius: "10px",
              padding: "8px 18px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: saved ? "none" : "0 0 20px rgba(34,211,238,0.4)",
              transition: "all 0.2s",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
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
              <polyline
                points="7 3 7 8 15 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Save
          </button>
        </div>
      </div>

      {/* Sections + Editor */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <SectionsPanel
          notebook={notebook}
          sections={sections}
          setSections={setSections}
          activeId={activeId}
          setActiveId={setActiveId}
          loading={loading}
          onAdd={handleAddSection}
          onDelete={handleDeleteSection}
          onRename={handleRename}
          onClose={() => navigate("/dashboard")}
        />
        <EditorPanel
          active={active}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
          onAddSection={handleAddSection}
        />
      </div>
    </AppLayout>
  );
}
