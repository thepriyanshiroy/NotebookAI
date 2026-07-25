import { useState } from "react";
import Navbar from "../dashboard/Navbar";
import Sidebar from "../dashboard/Sidebar";
import bg from "../../assets/background.jpg";

export default function AppLayout({ children, notebookCount }) {
  const [search, setSearch] = useState("");

  return (
    <div
      style={{
        height: "100vh",
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
        
        @media (max-width: 768px) {
          .layout-split { flex-direction: column !important; overflow-y: auto !important; }
          .sidebar-container { 
            width: 100% !important; 
            border-right: none !important; 
            border-bottom: 1px solid rgba(34,211,238,0.1) !important; 
            padding: 20px 16px !important; 
            flex-shrink: 0;
          }
          .main-content { overflow-y: visible !important; }
          .blob-cyan, .blob-pink, .blob-orange { display: none; } /* Hide blobs on mobile to save performance */
        }
      `}</style>

      {/* Dark overlay + blobs */}
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

      {/* Everything above overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Navbar search={search} setSearch={setSearch} />
        <div className="layout-split" style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <Sidebar notebookCount={notebookCount} />
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
