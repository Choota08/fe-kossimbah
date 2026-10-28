import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Kos } from "@/types/kos";

export type KosQueryParams = {
  search?: string;
  location?: string;
  sort?: string;
};

const fetchKos = async (params?: KosQueryParams): Promise<Kos[]> => {
  const res = await api.get("/kos", { params });
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const useKosQuery = (params?: KosQueryParams) => {
  return useQuery<Kos[]>({
    queryKey: ["kos", params],
    queryFn: () => fetchKos(params),
    staleTime: 60_000,

    // ✅ PENGGANTI keepPreviousData di v5
    placeholderData: (previousData) => previousData,
  });
};
