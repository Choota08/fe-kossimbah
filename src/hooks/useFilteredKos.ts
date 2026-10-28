import { useMemo } from "react";
import type { Kos } from "@/types/kos";

type Params = {
  kosList: Kos[];
  searchQuery: string;
  selectedLocation: string;
  sortBy: string;
};

export const useFilteredKos = ({
  kosList,
  searchQuery,
  selectedLocation,
  sortBy,
}: Params) => {
  return useMemo(() => {
    let filtered = kosList.filter(k => !k.is_full);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (k) =>
          k.name.toLowerCase().includes(q) ||
          k.description?.toLowerCase().includes(q)
      );
    }

    if (selectedLocation !== "Semua") {
      filtered = filtered.filter((k) =>
        k.address.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price_per_month - b.price_per_month);
    }

    if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price_per_month - a.price_per_month);
    }

    return filtered;
  }, [kosList, searchQuery, selectedLocation, sortBy]);
};
