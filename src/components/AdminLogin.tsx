import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "admin@example.com" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin/dashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-32 pb-16">
      <div className="max-w-md w-full animate-fade-in-up">
        
        <div className="glass-card p-10 rounded-3xl shadow-xl border border-gold/20">
          <h1 className="text-4xl font-serif font-bold text-center text-charcoal mb-8">
            Admin Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-charcoal/70 mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gold py-2.5 px-4 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-charcoal/70 mb-1 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gold py-2.5 px-4 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gold text-white rounded-xl font-medium hover:bg-gold/90 transition-all"
            >
              Login
            </button>
          </form>
        </div>

        {/* Decorative Info Box */}
        <div className="mt-6 text-center text-sm text-charcoal/60">
          <p>Authorized personnel access only.</p>
        </div>
      </div>
    </div>
  );
}
