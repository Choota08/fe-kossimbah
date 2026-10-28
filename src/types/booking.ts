import type { Kos } from "./kos";

export interface Booking {
  id: number;

  kos_id: number;
  user_id: number;

  start_date: string;
  end_date: string;

  status: "pending" | "confirmed" | "rejected" | "cancelled" | "completed";

  created_at: string;

  // 🔗 RELATIONS (dari backend Laravel)
  user: {
    name: string;
    email: string;
  };

  kos: Kos; // ✅ FULL KOS TYPE (ada id, images, dll)
}
