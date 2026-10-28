import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft, Phone } from "lucide-react";
import AnimatedEye from "@/components/AnimatedEye";
import nightBg from "/image/night-bg.jpg";
import api from "@/lib/api";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Password tidak cocok!");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/users", {
        name,
        email,
        phone,
        password,
        password_confirmation: confirmPassword, // ✅ TAMBAHAN WAJIB
        role: "user" // ❗ tetap, tidak diubah
      });

      console.log("✅ Register sukses:", response.data);
      alert("Register berhasil! Silakan login.");
      navigate("/login");
    } catch (error: any) {
      console.error("❌ Register gagal:", error.response?.data);

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        setError(Object.values(errors).flat().join(", "));
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Register gagal. Coba lagi!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4
                 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${nightBg})` }}
    >
      <div className="absolute inset-0 bg-background/40" />

      <div className="glass-card p-10 w-full max-w-md min-h-[560px]
                      relative z-10 animate-fade-in">

        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 p-2 rounded-full
                     text-muted-foreground hover:text-primary
                     hover:bg-background/40 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <img
            src="/image/logoowl.png"
            alt="logoowl"
            className="w-12 h-10 mx-auto mb-3"
          />
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Neues Konto
          </h1>
          <p className="text-muted-foreground">
            Sign up to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {error && (
            <div className="p-3 bg-red-100 border border-red-400
                            text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2
                             w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-auth pl-12"
              required
              disabled={loading}
            />
          </div>

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
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2
                              w-5 h-5 text-muted-foreground" />
            <input
              type="tel"
              placeholder="No. Telepon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-auth pl-12"
              required
              disabled={loading}
            />
          </div>

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
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         text-muted-foreground hover:text-primary transition"
              disabled={loading}
            >
              <AnimatedEye isOpen={showPassword} />
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2
                             w-5 h-5 text-muted-foreground" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-auth pl-12 pr-12"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         text-muted-foreground hover:text-primary transition"
              disabled={loading}
            >
              <AnimatedEye isOpen={showConfirmPassword} />
            </button>
          </div>

          <button
            type="submit"
            className="btn-gold w-full"
            disabled={loading}
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm">atau</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <p className="text-center text-muted-foreground">
          Sudah punya akun?{" "}
          <Link to="/login" className="link-gold font-semibold">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;