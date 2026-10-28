import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import AnimatedEye from "@/components/AnimatedEye";
import axios from "axios";

import { useAuth } from "@/hooks/use-auth-temp";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/login",
        { email, password },
        { withCredentials: true }
      );

      // ✅ SIMPAN LOGIN KE useAuth (WAJIB)
      login({
        id: res.data.user.id,
        email: res.data.user.email,
        role: res.data.user.role ?? "user",
      });

      // (opsional) simpan token
      if (res.data.token) {
       // SESUDAH (BENAR)
        localStorage.setItem("auth_token", res.data.token);
      }

      // redirect sukses
      navigate("/");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4
                 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url(/image/night-bg.jpg)" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/40" />

      {/* Login Card */}
      <div
        className="glass-card p-10 w-full max-w-md min-h-[520px]
                   relative z-10 animate-fade-in"
      >
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 p-2 rounded-full
                     text-muted-foreground hover:text-primary
                     hover:bg-background/40 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/image/logoowl.png"
            alt="logoowl"
            className="w-12 h-10 mx-auto mb-3"
          />
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Willkommen
          </h1>
          <p className="text-muted-foreground">Sign in</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2
                             w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-auth pl-12"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2
                             w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-auth pl-12 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         text-muted-foreground hover:text-primary transition"
            >
              <AnimatedEye isOpen={showPassword} />
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              btn-primary w-full
              hover:gold-glow
              disabled:opacity-60 disabled:cursor-not-allowed"
              >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm">atau</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Register */}
        <p className="text-center text-muted-foreground">
          Belum punya akun?{" "}
          <Link to="/register" className="link-gold font-semibold">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
