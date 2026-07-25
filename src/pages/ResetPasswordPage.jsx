import { useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import bg from "../assets/background.jpg";

const resetSchema = z.object({
  password: z.string().min(12, { message: "Password must be at least 12 characters" }),
});

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = (data) => {
    setError("");
    setSuccess(false);
    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password: data.password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <nav className="px-8 py-5">
        <span className="text-white font-bold text-xl tracking-tight">
          Notebook<span className="text-cyan-400">AI</span>
        </span>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-10 shadow-2xl relative">
          
          <button 
            onClick={() => navigate(-1)} 
            className="absolute -top-12 left-0 text-white/40 hover:text-cyan-400 flex items-center gap-2 text-sm font-medium transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back
          </button>

          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
            <span className="text-white/40 text-xs tracking-widest uppercase">
              Secure Account
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
            New Password
          </h1>
          <p className="text-white/40 text-sm mb-8">
            Enter your new password below.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form name="reset" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs uppercase tracking-widest">
                New Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••••••"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-cyan-400/60 focus:bg-cyan-400/5 focus:ring-2 focus:ring-cyan-400/10 transition"
              />
              {errors.password && (
                <span className="text-red-400 text-xs mt-1">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 bg-cyan-400 hover:bg-cyan-300 disabled:bg-cyan-400/40 disabled:cursor-not-allowed text-black font-bold text-sm tracking-widest uppercase py-3.5 rounded-xl transition shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]"
            >
              {isPending ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
