import { useState } from "react";
import Navbar from "../dashboard/Navbar";
import Sidebar from "../dashboard/Sidebar";
import bg from "../../assets/background.jpg";

export default function AppLayout({ children, notebookCount, search, setSearch, hideNavbar = false }) {
  const [localSearch, setLocalSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchValue = search !== undefined ? search : localSearch;
  const setSearchValue = setSearch !== undefined ? setSearch : setLocalSearch;

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .blob-cyan   { position:fixed; width:700px; height:700px; border-radius:50%; background:radial-gradient(circle,rgba(34,211,238,0.18) 0%,transparent 65%); bottom:-250px; left:-200px; pointer-events:none; z-index:0; animation:floatA 14s ease-in-out infinite; }
        .blob-pink   { position:fixed; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(219,39,119,0.15) 0%,transparent 65%); top:-180px; right:-120px; pointer-events:none; z-index:0; animation:floatB 17s ease-in-out infinite; }
        .blob-orange { position:fixed; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(234,88,12,0.12) 0%,transparent 65%); bottom:-80px; right:80px; pointer-events:none; z-index:0; animation:floatC 11s ease-in-out infinite; }
        @keyframes floatA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-20px)} }
        @keyframes floatB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-25px,28px)} }
        @keyframes floatC { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,-16px)} }
        @keyframes spin   { to { transform: rotate(360deg) } }
        textarea { resize: none; }
        textarea:focus { outline: none; }
        textarea::placeholder { color: rgba(150,200,255,0.2); }
        input:focus { outline: none; }
        input::placeholder { color: rgba(150,200,255,0.2); }
        .sec-item:hover .del-btn { opacity: 1 !important; }
        ::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.15); border-radius: 2px; }
        
        @media (max-width: 767px) {
          .layout-split { flex-direction: column !important; }
          .sidebar-container { 
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100dvh !important;
            width: 280px !important;
            flex-direction: column !important;
            padding: 32px 24px !important;
            z-index: 50 !important;
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
            background: rgba(5,7,18,0.95) !important;
            backdrop-filter: blur(40px) !important;
            border-right: 1px solid rgba(255,255,255,0.07) !important;
            border-bottom: none !important;
          }
          .sidebar-container.open {
            transform: translateX(0);
          }
          .sidebar-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 40;
            display: none;
          }
          .sidebar-overlay.open {
            display: block;
          }
          .sidebar-container button { width: 100% !important; margin-bottom: 6px !important; padding: 14px 18px !important; }
          .blob-cyan, .blob-pink, .blob-orange { display: none; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: "rgba(4,6,18,0.72)",
        }}
      />
      <div className="blob-cyan" />
      <div className="blob-pink" />
      <div className="blob-orange" />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
        }}
      >
        {!hideNavbar && (
          <Navbar
            search={searchValue}
            setSearch={setSearchValue}
            onMenuClick={() => setMobileMenuOpen(true)}
          />
        )}
        <div className="layout-split" style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div
            className={`sidebar-overlay ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          />
          <Sidebar
            notebookCount={notebookCount}
            className={`sidebar-container ${mobileMenuOpen ? "open" : ""}`}
            onItemClick={() => setMobileMenuOpen(false)}
          />
          <main
            className="main-content"
            style={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
