import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 12) {
      setError("Password must be at least 12 characters");
      return;
    }
    setLoading(true);
    try {
      await signUp({ email, password, full_name: fullName });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: "url('/src/assets/background.jpg')" }}
    >
      {/* Nav */}
      <nav className="px-8 py-5">
        <span className="text-white font-bold text-xl tracking-tight">
          Notebook<span className="text-cyan-400">AI</span>
        </span>
      </nav>

      {/* Center */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-10 shadow-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
            <span className="text-white/40 text-xs tracking-widest uppercase">
              AI Powered Student Workspace
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
            Create account
          </h1>
          <p className="text-white/40 text-sm mb-8">
            Start organizing your studies with AI
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs uppercase tracking-widest">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Rivera"
                required
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-cyan-400/60 focus:bg-cyan-400/5 focus:ring-2 focus:ring-cyan-400/10 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                required
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-cyan-400/60 focus:bg-cyan-400/5 focus:ring-2 focus:ring-cyan-400/10 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs uppercase tracking-widest">
                Password
                <span className="normal-case tracking-normal text-white/25 ml-1">
                  — min. 12 characters
                </span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-cyan-400/60 focus:bg-cyan-400/5 focus:ring-2 focus:ring-cyan-400/10 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-cyan-400 hover:bg-cyan-300 disabled:bg-cyan-400/40 disabled:cursor-not-allowed text-black font-bold text-sm tracking-widest uppercase py-3.5 rounded-xl transition shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
