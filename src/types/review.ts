import type { Kos } from "./kos";

export interface Review {
  id: number;

  kos_id: number;
  user_id: number;

  comment: string;
  rating: number;
  created_at: string;

  user: {
    id: number;
    name: string;
  };

  // relasi
  kos?: Kos;
}
