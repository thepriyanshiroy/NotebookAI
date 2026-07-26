import { useNavigate } from "react-router-dom";
import bg from "../assets/background.jpg";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 overflow-hidden flex flex-col items-center justify-center text-center px-6"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@300;400;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #22d3ee; }
          50%       { opacity: 0.5; box-shadow: 0 0 18px #22d3ee; }
        }

        .anim-1 { animation: fadeUp 0.7s ease 0.0s both; }
        .anim-2 { animation: fadeUp 0.7s ease 0.15s both; }
        .anim-3 { animation: fadeUp 0.7s ease 0.30s both; }
        .anim-4 { animation: fadeUp 0.7s ease 0.45s both; }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }

        .cta-btn {
          background: #22d3ee;
          color: #000;
          border: none;
          border-radius: 50px;
          padding: 16px 56px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 0 40px rgba(34,211,238,0.5);
        }
        .cta-btn:hover {
          background: #67e8f9;
          box-shadow: 0 0 70px rgba(34,211,238,0.75);
          transform: translateY(-3px);
        }
      `}</style>

      {/* Badge */}
      <div className="anim-1 flex items-center gap-3 bg-black/50 border border-white/15 rounded-full px-5 py-2 mb-14">
        <span className="pulse-dot w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
        <span
          className="text-white/70 text-xs font-semibold tracking-widest uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          AI Powered Student Workspace
        </span>
      </div>

      {/* Title */}
      <div className="anim-2 mb-5">
        {/* NotebookAI */}
        <h1
          className="font-extrabold leading-none tracking-tight"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(40px, 10vw, 100px)",
          }}
        >
          <span className="text-white">Notebook</span>
          <span className="text-cyan-400">AI</span>
        </h1>

        {/* Tagline */}
        <h2
          className="font-light leading-tight tracking-tight text-white/85 mt-2 md:mt-4"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(20px, 6vw, 66px)",
          }}
        >
          Understand Your Notes Faster
        </h2>
      </div>

      {/* Description */}
      <p
        className="anim-3 text-white/50 leading-relaxed max-w-lg mb-14"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(14px, 1.8vw, 17px)",
        }}
      >
        Upload PDFs and images, organize them into notebooks, and generate
        intelligent summaries instantly using AI.
      </p>

      {/* Button */}
      <div className="anim-4">
        <button className="cta-btn" onClick={() => navigate("/signup")}>
          Get Started
        </button>
      </div>
    </div>
  );
}
