import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 11 12 3l9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    label: "Notebooks",
    path: "/notebooks",
    countKey: "notebooks",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" />
        <path d="M8 4v16" />
      </svg>
    ),
  },
  {
    label: "Saved PDFs",
    path: "/saved",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
    ),
  },
  {
    label: "AI Summaries",
    path: "/summaries",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 14.4 8 20 9l-4 4 1 5.5-5-2.7-5 2.7L8 13 4 9l5.6-1z" />
      </svg>
    ),
  },
  {
    label: "Profile",
    path: "/dashboard",
    mobileOnly: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="8" r="4" />
      </svg>
    ),
  },
];

function NavItem({ item, count }) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `app-nav-link ${item.mobileOnly ? "mobile-only" : ""} ${
          isActive && !item.mobileOnly ? "active" : ""
        }`
      }
    >
      {item.icon}
      <span>{item.label}</span>
      {typeof count === "number" && <strong>{count}</strong>}
    </NavLink>
  );
}

export default function Sidebar({ notebookCount }) {
  const { user } = useAuth();
  const [dbCount, setDbCount] = useState(0);

  useEffect(() => {
    if (notebookCount !== undefined && notebookCount !== null) return;
    const fetchCount = async () => {
      if (!user) return;
      const { count } = await supabase
        .from("notebooks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setDbCount(count || 0);
    };
    fetchCount();
  }, [notebookCount, user]);

  const count = notebookCount ?? dbCount;
  const fullName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";

  return (
    <>
      <aside className="app-sidebar" aria-label="Primary navigation">
        <div className="sidebar-brand">
          <div className="brand-mark">N</div>
          <div>
            <h2>
              Notebook<span>AI</span>
            </h2>
            <p>Student workspace</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems
            .filter((item) => !item.mobileOnly)
            .map((item) => (
              <NavItem
                key={item.label}
                item={item}
                count={item.countKey === "notebooks" ? count : undefined}
              />
            ))}
        </nav>

        <div className="sidebar-user">
          <p>{fullName}</p>
          <span>Student</span>
        </div>
      </aside>

      <nav className="mobile-bottom-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            count={item.countKey === "notebooks" ? count : undefined}
          />
        ))}
      </nav>
    </>
  );
}
