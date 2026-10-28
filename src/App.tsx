import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Index from "@/pages/user/Index";
import Kos from "@/pages/user/Kos";
import KosDetail from "@/pages/user/KosDetail";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// User Pages
import Profile from "@/pages/user/Profile";
import UserDashboard from "@/pages/user/UserDashboard";
import BookingHistory from "@/pages/user/History";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CreateKos from "@/pages/admin/CreateKos";
import EditKos from "@/pages/admin/EditKos";
import AdminBookings from "@/pages/admin/AdminBooking";

// Fallback Page
import NotFound from "@/pages/NotFound";

// Guards
import AdminRoute from "@/AdminRoute";
import AuthGuard from "@/auth-guard";

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Index />} />
        <Route path="/kos" element={<Kos />} />
        <Route path="/kos/:id" element={<KosDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= USER ================= */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <UserDashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/history"
          element={
            <AuthGuard>
              <BookingHistory />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/booking" element={<AdminBookings />} />
          <Route path="/admin/create-kos" element={<CreateKos />} />
          <Route path="/admin/edit-kos/:id" element={<EditKos />} />
        </Route>

        {/* ================= NOT FOUND ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;