import { useNavigate } from "react-router-dom";

export default function EditorTopbar({
  notebook,
  activeSection,
  saved,
  onSave,
}) {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-between px-8 flex-shrink-0 border-b border-white/[0.08]"
      style={{
        height: "56px",
        background: "rgba(5,7,20,0.98)",
        backdropFilter: "blur(40px)",
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm font-medium transition-opacity duration-150 hover:opacity-60"
          style={{
            color: "#22d3ee",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontFamily: "inherit",
          }}
        >
          {notebook?.title || "Notebook"}
        </button>

        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <polyline
            points="9 18 15 12 9 6"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="text-sm font-bold text-white">
          {activeSection?.title || "—"}
        </span>
      </div>

      {/* Save area */}
      <div className="flex items-center gap-4">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-[#22d3ee]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
          onClick={onSave}
          className="flex items-center gap-2 text-sm font-bold rounded-xl px-5 py-2 transition-all duration-200"
          style={{
            background: saved ? "transparent" : "#22d3ee",
            color: saved ? "#22d3ee" : "#000",
            border: "1.5px solid #22d3ee",
            boxShadow: saved ? "none" : "0 0 20px rgba(34,211,238,0.4)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
  );
}
