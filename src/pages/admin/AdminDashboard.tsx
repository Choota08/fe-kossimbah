import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

/* =======================
   INTERFACE
======================= */
interface Image {
  id: number;
  file: string;
}

interface Kos {
  id: number;
  name: string;
  address: string;
  price_per_month: number;
  is_full?: boolean;
  images?: Image[];
}

/* =======================
   COMPONENT
======================= */
export default function AdminDashboard() {
  const [kosList, setKosList] = useState<Kos[]>([]);
  const [loading, setLoading] = useState(true);

  const storageUrl =
    import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage";

  /* =======================
     FETCH DATA
  ======================= */
  const fetchKos = async () => {
    try {
      const res = await api.get("/kos");
      setKosList(res.data.data ?? []);
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengambil data kos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKos();
  }, []);

  /* =======================
     DELETE
  ======================= */
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kos ini?")) return;

    try {
      await api.delete(`/kos/${id}`);
      setKosList((prev) => prev.filter((k) => k.id !== id));

      toast({
        title: "Berhasil",
        description: "Kos berhasil dihapus",
      });
    } catch {
      toast({
        title: "Error",
        description: "Gagal menghapus kos",
        variant: "destructive",
      });
    }
  };

  /* =======================
     RENDER
  ======================= */
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
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gold/10 text-gold font-medium"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            to="/booking"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-secondary"
          >
            <ClipboardList className="w-5 h-5" />
            Booking
          </Link>
        </nav>
      </aside>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold">
                Manajemen <span className="text-gold">Kos</span>
              </h1>
              <p className="text-muted-foreground">
                Kelola data kos yang tersedia
              </p>
            </div>

            <Link to="/admin/create-kos">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kos
              </Button>
            </Link>
          </div>

          {/* CONTENT */}
          {loading ? (
            <p>Memuat data...</p>
          ) : kosList.length === 0 ? (
            <p className="text-muted-foreground">Belum ada data kos</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {kosList.map((kos) => (
                <div
                  key={kos.id}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  {/* IMAGE */}
                  <div className="aspect-[4/3] bg-muted">
                    <img
                      src={
                        kos.images && kos.images.length > 0
                          ? `${storageUrl}/${kos.images[0].file}`
                          : "/placeholder.jpg"
                      }
                      alt={kos.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* BODY */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold">{kos.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {kos.address}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-gold font-semibold">
                        Rp {kos.price_per_month.toLocaleString("id-ID")}
                      </span>

                      <Badge variant={kos.is_full ? "destructive" : "outline"}>
                        {kos.is_full ? "Penuh" : "Tersedia"}
                      </Badge>
                    </div>

                    {/* ACTION */}
                    <div className="flex justify-end gap-2 pt-3">
                      <Link to={`/admin/edit-kos/${kos.id}`}>
                        <Button size="icon" variant="ghost">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(kos.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
