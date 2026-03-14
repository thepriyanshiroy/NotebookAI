import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center gap-4"
      style={{ backgroundImage: "url('/src/assets/background.jpg')" }}
    >
      <h1 className="text-white text-2xl font-bold">✅ Logged in!</h1>
      <p className="text-white/40 text-sm">{user?.email}</p>
      <button
        onClick={handleLogout}
        className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-sm px-6 py-2.5 rounded-xl transition"
      >
        Logout
      </button>
    </div>
  );
}
