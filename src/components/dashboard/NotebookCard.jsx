import { useNavigate } from "react-router-dom";

const COLORS = [
  { primary: "#22d3ee" },
  { primary: "#e879a0" },
  { primary: "#f97316" },
  { primary: "#2dd4bf" },
  { primary: "#a78bfa" },
  { primary: "#fbbf24" },
];

const getColor = (hex) =>
  COLORS.find((color) => color.primary === hex)?.primary || COLORS[0].primary;

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return `${weeks}w ago`;
}

export default function NotebookCard({ notebook, onDelete, compact = false }) {
  const navigate = useNavigate();
  const color = getColor(notebook.icon_color);
  const sectionCount = notebook.sections?.[0]?.count ?? 0;

  return (
    <article
      className={`notebook-card ${compact ? "compact" : ""}`}
      style={{ "--card-color": color }}
    >
      <button
        className="card-open-area"
        type="button"
        onClick={() => navigate(`/notebook/${notebook.id}`)}
        aria-label={`Open ${notebook.title}`}
      >
        <span className="card-topline">
          <span className="notebook-icon" aria-hidden="true">
            {notebook.emoji || "NB"}
          </span>
          <span className="card-time">{timeAgo(notebook.updated_at)}</span>
        </span>

        <span>
          <span className="card-title">{notebook.title}</span>
          <p>{notebook.subject || "No subject"}</p>
        </span>

        <span className="card-footer">
          <span>
            <span className="card-metric">{sectionCount}</span>
            <p>Sections</p>
          </span>
          <span className="secondary-action">Open</span>
        </span>
      </button>

      {onDelete && (
        <button
          className="delete-icon-button card-delete"
          type="button"
          onClick={() => onDelete(notebook.id)}
          aria-label={`Delete ${notebook.title}`}
        >
          <svg viewBox="0 0 24 24" className="small-icon" aria-hidden="true">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="m19 6-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      )}
    </article>
  );
}
