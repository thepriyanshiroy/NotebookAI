import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../dashboard/Navbar";
import Sidebar from "../dashboard/Sidebar";
import bg from "../../assets/background.jpg";

const TITLES = {
  "/dashboard": "Dashboard",
  "/notebooks": "Notebooks",
  "/saved": "Saved PDFs",
  "/summaries": "AI Summaries",
};

export default function AppLayout({
  children,
  notebookCount,
  search,
  setSearch,
  searchPlaceholder,
}) {
  const location = useLocation();

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith("/notebook")) return "Notebook";
    return TITLES[location.pathname] || "NotebookAI";
  }, [location.pathname]);

  return (
    <div
      className="app-shell"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="app-backdrop" />
      <div className="app-frame">
        <Sidebar notebookCount={notebookCount} />
        <div className="app-workspace">
          <Navbar
            title={pageTitle}
            search={search}
            setSearch={setSearch}
            searchPlaceholder={searchPlaceholder}
          />
          <main className="app-main" id="main-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
