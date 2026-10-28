import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  Check,
  X,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import type { Booking } from "@/types/booking";

/* =====================
   HELPER FORMAT TANGGAL
   ===================== */
const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/admin/bookings");
      setBookings(res.data);
    } catch {
      toast({
        title: "Error",
        description: "Gagal memuat data booking",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (
    id: number,
    action: "approve" | "reject" | "complete"
  ) => {
    setActionLoading(id);
    try {
      await api.patch(`/admin/bookings/${id}/${action}`);
      toast({
        title: "Berhasil",
        description: "Status booking diperbarui",
      });
      fetchBookings();
    } catch {
      toast({
        title: "Error",
        description: "Gagal memperbarui status booking",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-card border-r border-border hidden md:block">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-luxury-navy/80 flex items-center justify-center">
              <img src="/image/logoowl.png" alt="logo" className="w-7 h-7" />
            </div>
            <span className="font-serif font-semibold text-xl tracking-wide">
              Kos<span className="text-gold">Simbah</span>
            </span>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-secondary"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            to="/booking"
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gold/10 text-gold font-medium"
          >
            <ClipboardList className="w-5 h-5" />
            Booking
          </Link>
        </nav>
      </aside>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="font-serif text-2xl md:text-3xl font-bold">
              Manajemen <span className="text-gold">Booking</span>
            </h1>
            <p className="text-muted-foreground">
              Kelola booking kos dari pengguna
            </p>
          </div>

          {/* TABLE */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {isLoading ? (
              <div className="p-10 flex items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                Memuat data booking...
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Belum ada data booking
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm">User</th>
                    <th className="px-4 py-3 text-left text-sm">Kos</th>
                    <th className="px-4 py-3 text-left text-sm">Tanggal</th>
                    <th className="px-4 py-3 text-left text-sm">Status</th>
                    <th className="px-4 py-3 text-right text-sm">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-secondary/50">
                      <td className="px-4 py-3">
                        <p className="font-medium">{booking.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.user.email}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-medium">{booking.kos.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.kos.address}
                        </p>
                      </td>

                      {/* ✅ TANGGAL SUDAH NORMAL */}
                      <td className="px-4 py-3 text-sm">
                        {formatDate(booking.start_date)} –{" "}
                        {formatDate(booking.end_date)}
                      </td>

                      <td className="px-4 py-3">
                        {statusBadge(booking.status)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {booking.status === "pending" && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  updateStatus(booking.id, "approve")
                                }
                                disabled={actionLoading === booking.id}
                              >
                                <Check className="w-4 h-4 text-green-600" />
                              </Button>

                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  updateStatus(booking.id, "reject")
                                }
                                disabled={actionLoading === booking.id}
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </Button>
                            </>
                          )}

                          {booking.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="gold"
                              onClick={() =>
                                updateStatus(booking.id, "complete")
                              }
                              disabled={actionLoading === booking.id}
                            >
                              Selesaikan
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminBookings;
