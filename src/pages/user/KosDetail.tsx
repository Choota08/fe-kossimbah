import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth-temp";
import api from "@/lib/api";

import { KosImage } from "@/components/kos/KosImage";
import { KosFacilities } from "@/components/kos/KosFacilities";
import { KosReviews } from "@/components/kos/KosReviews";
import { KosBookingSidebar } from "@/components/kos/KosBookingSidebar";

import type { Kos } from "@/types/kos";

export default function KosDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [kos, setKos] = useState<Kos | null>(null);
  const [loading, setLoading] = useState(true);

  const [reviewText, setReviewText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  /* =====================
     FETCH KOS
     ===================== */
  const fetchKos = async () => {
    const res = await api.get(`/kos/${id}`);
    setKos(res.data.data);
  };

  useEffect(() => {
    fetchKos()
      .catch(() =>
        toast({
          title: "Gagal memuat data",
          description: "Kos tidak ditemukan",
          variant: "destructive",
        })
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat data...
      </div>
    );
  }

  if (!kos) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Kos tidak ditemukan</h1>
          <Link to="/kos">Kembali</Link>
        </div>
      </div>
    );
  }

  /* =====================
     HELPERS
     ===================== */
  const images =
    kos.images.length > 0
      ? kos.images.map(
          (img) =>
            `${import.meta.env.VITE_API_URL}/storage/${img.file}`
        )
      : ["/image/placeholder.jpg"];

  const isOccupied = kos.is_full === true;

  const requireLogin = (action: () => void) => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Silakan login terlebih dahulu",
      });
      navigate("/login", { state: { from: location } });
      return;
    }
    action();
  };

  /* =====================
     BOOKING
     ===================== */
  const handleBooking = async () => {
    if (isOccupied) {
      toast({
        title: "Kos sudah terisi",
        description: "Kos ini sedang ditempati",
        variant: "destructive",
      });
      return;
    }

    if (!startDate) {
      toast({
        title: "Tanggal belum dipilih",
        description: "Silakan pilih tanggal masuk",
        variant: "destructive",
      });
      return;
    }

    try {
      setBookingLoading(true);

      const start = new Date(startDate);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      await api.post("/bookings", {
        kos_id: kos.id,
        start_date: start.toISOString().slice(0, 10),
        end_date: end.toISOString().slice(0, 10),
      });

      toast({
        title: "Booking berhasil 🎉",
        description:
          "Check-in pukul 10.00 WIB. Menunggu persetujuan admin.",
      });
    } catch (error: any) {
      toast({
        title: "Booking gagal",
        description:
          error.response?.data?.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  /* =====================
     REVIEW
     ===================== */
  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      toast({
        title: "Error",
        description: "Review tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    await api.post("/reviews", {
      kos_id: kos.id,
      comment: reviewText,
      rating: 5,
    });

    setReviewText("");
    await fetchKos();

    toast({
      title: "Review terkirim",
      description: "Terima kasih atas review Anda",
    });
  };

  /* =====================
     RENDER
     ===================== */
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN */}
          <div className="lg:col-span-2 space-y-8">
            <KosImage images={images} name={kos.name} />

            <div className="space-y-2">
              <Badge className="capitalize">{kos.gender}</Badge>
              <h1 className="text-3xl font-bold">{kos.name}</h1>
              <p className="text-muted-foreground">{kos.address}</p>
            </div>

            <KosFacilities facilities={kos.facilities} />

            <KosReviews
              reviews={kos.reviews}
              reviewText={reviewText}
              setReviewText={setReviewText}
              onSubmit={() => requireLogin(handleSubmitReview)}
            />
          </div>

          {/* SIDEBAR */}
          <KosBookingSidebar
            price={kos.price_per_month}
            startDate={startDate}
            setStartDate={setStartDate}
            isOccupied={isOccupied}
            bookingLoading={bookingLoading}
            onBook={() => requireLogin(handleBooking)}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
