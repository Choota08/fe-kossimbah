import type { Review } from "./review";

export interface Kos {
  id: number;
  name: string;
  address: string;
  price_per_month: number;
  gender: "male" | "female" | "all";

  description?: string; // ✅ TAMBAHKAN INI

  is_full?: boolean;

  images: {
    id: number;
    kos_id: number;
    file: string;
  }[];

  facilities: {
    id: number;
    kos_id: number;
    facility: string;
  }[];

  reviews: Review[];
}
