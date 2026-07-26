import { useEffect, useState } from "react";

const COLORS = [
  { primary: "#22d3ee", secondary: "#06b6d4" },
  { primary: "#e879a0", secondary: "#db2777" },
  { primary: "#f97316", secondary: "#ea580c" },
  { primary: "#2dd4bf", secondary: "#0d9488" },
];

const ICONS = ["NB", "PH", "CH", "MT", "GE", "ST", "AI", "CS", "AR", "LB", "NT", "HS"];

export default function NewNotebookModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const [emoji, setEmoji] = useState("NB");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const color = COLORS[colorIdx];

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onAdd({
        title: title.trim(),
        subject: subject.trim(),
        icon_color: color.primary,
        emoji,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <section
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-notebook-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="page-eyebrow">Create</p>
            <h2 id="new-notebook-title">New Notebook</h2>
          </div>
          <button
            className="delete-icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg viewBox="0 0 24 24" className="small-icon" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <label className="field-label">
          Title
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleCreate()}
            placeholder="Quantum Mechanics"
          />
        </label>

        <label className="field-label">
          Subject
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Physics"
          />
        </label>

        <div>
          <p className="field-caption">Icon</p>
          <div className="icon-picker">
            {ICONS.map((icon) => (
              <button
                key={icon}
                className={emoji === icon ? "selected" : ""}
                type="button"
                onClick={() => setEmoji(icon)}
                aria-pressed={emoji === icon}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="field-caption">Accent color</p>
          <div className="color-picker">
            {COLORS.map((option, index) => (
              <button
                key={option.primary}
                className={index === colorIdx ? "selected" : ""}
                style={{
                  background: `linear-gradient(135deg, ${option.primary}, ${option.secondary})`,
                }}
                type="button"
                onClick={() => setColorIdx(index)}
                aria-label={`Use accent color ${index + 1}`}
                aria-pressed={index === colorIdx}
              />
            ))}
          </div>
        </div>

        <div className="modal-preview" style={{ "--card-color": color.primary }}>
          <span className="notebook-icon">{emoji}</span>
          <div>
            <h3>{title || "Notebook title"}</h3>
            <p>{subject || "No subject"} - 0 sections</p>
          </div>
        </div>

        <div className="modal-actions">
          <button className="ghost-action" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="primary-action"
            type="button"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create notebook"}
          </button>
        </div>
      </section>
    </div>
  );
}
