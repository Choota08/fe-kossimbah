import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  // ambil data login dari localStorage
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  // belum login
  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userRaw);

  // butuh admin tapi user bukan admin
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // lolos semua cek
  return <>{children}</>;
};

export default AuthGuard;
