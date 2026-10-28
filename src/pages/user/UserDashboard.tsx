import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Star, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";

import type { Booking } from "@/types/booking";
import type { Review } from "@/types/review";

const UserDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/profile");
        setBookings(res.data.bookings ?? []);
        setReviews(res.data.reviews ?? []);
      } catch {
        toast({
          title: "Gagal memuat data",
          description: "Silakan coba lagi",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Dikonfirmasi";
      case "pending":
        return "Menunggu";
      case "completed":
        return "Selesai";
      case "rejected":
        return "Ditolak";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
              Dashboard <span className="text-gold">Saya</span>
            </h1>
            <p className="text-muted-foreground">
              Kelola booking dan review Anda
            </p>
          </motion.div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="w-4 h-4" />
                Booking Saya
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Review Saya
              </TabsTrigger>
            </TabsList>

            {/* BOOKINGS */}
            <TabsContent value="bookings" className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => {
                  const kos = booking.kos;
                  if (!kos) return null;

                  return (
                    <div
                      key={booking.id}
                      className="bg-card rounded-xl border overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 h-32">
                          <img
                            src={
                              kos.images.length > 0
                                ? `${import.meta.env.VITE_API_URL}/storage/${kos.images[0].file}`
                                : "/image/placeholder.jpg"
                            }
                            alt={kos.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 p-4 space-y-3">
                          <div className="flex justify-between">
                            <Link
                              to={`/kos/${kos.id}`}
                              className="font-semibold hover:text-gold"
                            >
                              {kos.name}
                            </Link>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusText(booking.status)}
                            </Badge>
                          </div>

                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {booking.start_date} - {booking.end_date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {booking.created_at}
                            </div>
                          </div>

                          {booking.status === "confirmed" && (
                            <div className="border-t pt-2 text-sm text-muted-foreground">
                              Menunggu admin mengonfirmasi selesai sewa
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground">
                  Belum ada booking
                </p>
              )}
            </TabsContent>

            {/* REVIEWS */}
            <TabsContent value="reviews" className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => {
                  const kos = review.kos;
                  if (!kos) return null;

                  return (
                    <div
                      key={review.id}
                      className="bg-card p-4 rounded-xl border"
                    >
                      <div className="flex gap-4">
                        <img
                          src={
                            kos.images.length > 0
                              ? `${import.meta.env.VITE_API_URL}/storage/${kos.images[0].file}`
                              : "/image/placeholder.jpg"
                          }
                          alt={kos.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 space-y-2">
                          <Link
                            to={`/kos/${kos.id}`}
                            className="font-semibold hover:text-gold"
                          >
                            {kos.name}
                          </Link>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-gold text-gold"
                                    : "text-border"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {review.comment}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {review.created_at}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground">
                  Belum ada review
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
