import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Package,
  MapPin,
  Star,
  CalendarCheck,
  CreditCard,
} from "lucide-react";

import api from "@/lib/api";
import { Navbar } from "@/components/Navbar";

/* =====================
   TYPES
   ===================== */
export type BookingStatus =
  | "confirmed"
  | "completed"
  | "cancelled"
  | "upcoming";

interface Booking {
  id: string;
  title: string;
  location: string;
  date: string;
  status: BookingStatus;
  image: string;
}

/* =====================
   HELPERS
   ===================== */
const mapStatus = (status: string): BookingStatus => {
  switch (status) {
    case "pending":
      return "upcoming";
    case "confirmed":
      return "confirmed";
    case "completed":
      return "completed";
    default:
      return "cancelled";
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const getImageUrl = (file?: string) =>
  file
    ? `${import.meta.env.VITE_API_URL}/storage/${file}`
    : "/image/placeholder.jpg";

/* =====================
   UI CONFIG
   ===================== */
const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  upcoming: {
    label: "Mendatang",
    className: "bg-primary/15 text-primary border border-primary/25",
  },
  confirmed: {
    label: "Dikonfirmasi",
    className: "bg-gold/15 text-gold border border-gold/25",
  },
  completed: {
    label: "Selesai",
    className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-destructive/15 text-destructive border border-destructive/25",
  },
};

const filters = [
  { id: "all", label: "Semua" },
  { id: "upcoming", label: "Mendatang" },
  { id: "completed", label: "Selesai" },
  { id: "cancelled", label: "Dibatalkan" },
] as const;

/* =====================
   COMPONENT
   ===================== */
const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] =
    useState<"all" | BookingStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  /* =====================
     FETCH BOOKINGS
     ===================== */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/me");

        const mapped: Booking[] = res.data.map((b: any) => ({
          id: String(b.id),
          title: b.kos?.name ?? "Kos",
          location: b.kos?.address ?? "-",
          date: `${formatDate(b.start_date)} – ${formatDate(b.end_date)}`,
          status: mapStatus(b.status),
          image: getImageUrl(b.kos?.images?.[0]?.file),
        }));

        setBookings(mapped);
      } catch (error) {
        console.error("Gagal ambil booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  /* =====================
     ACTIONS
     ===================== */
  const handleCancel = async (id: string) => {
    if (!confirm("Yakin ingin membatalkan booking ini?")) return;

    try {
      await api.patch(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "cancelled" } : b
        )
      );
    } catch {
      alert("Gagal membatalkan booking");
    }
  };

  const handleDownloadInvoice = async (id: string) => {
    try {
      const res = await api.get(`/bookings/${id}/invoice`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      alert("Gagal mengunduh invoice");
      console.error(err);
    }
  };

  /* =====================
     FILTERED DATA
     ===================== */
  const filteredBookings = useMemo(() => {
    return bookings
      .filter(
        (b) => activeFilter === "all" || b.status === activeFilter
      )
      .filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [bookings, activeFilter, searchQuery]);

  /* =====================
     LOADING
     ===================== */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-24">
          Memuat booking...
        </div>
      </>
    );
  }

  /* =====================
     RENDER
     ===================== */
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HEADER */}
      <section className="pt-28 pb-8 px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">
          Riwayat <span className="text-gradient-gold">Booking</span>
        </h1>
        <p className="text-muted-foreground mb-6">
          Lacak semua reservasi Anda
        </p>

        <div className="max-w-lg mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari booking..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border"
          />
        </div>
      </section>

      {/* LIST */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto space-y-4">
          <AnimatePresence>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => {
                const status = statusConfig[b.status];
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-card border rounded-xl overflow-hidden flex"
                  >
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-40 h-40 object-cover"
                    />

                    <div className="p-4 flex-1">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-bold">{b.title}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {b.location}
                      </p>
                      <p className="text-sm mb-3">{b.date}</p>

                      {b.status === "upcoming" && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="text-sm text-red-500 hover:underline"
                        >
                          Batalkan Booking
                        </button>
                      )}

                      {(b.status === "confirmed" ||
                        b.status === "completed") && (
                        <button
                          onClick={() => handleDownloadInvoice(b.id)}
                          className="text-sm text-gold hover:underline"
                        >
                          Download Invoice (PDF)
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <Package className="mx-auto mb-3" />
                Belum ada booking
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default BookingHistory;
