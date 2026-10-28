import { Filter } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const LOCATIONS = [
  "Semua",
  "Jakarta Selatan",
  "Jakarta Pusat",
  "Bandung",
  "Yogyakarta",
  "Surabaya",
];

type KosFilterBarProps = {
  location: string;
  setLocation: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
};

export const KosFilterBar = ({
  location,
  setLocation,
  sort,
  setSort,
}: KosFilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 my-8">
      <Filter className="w-4 h-4 text-muted-foreground" />

      {/* FILTER LOKASI */}
      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Semua Lokasi" />
        </SelectTrigger>
        <SelectContent>
          {LOCATIONS.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* SORT */}
      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="w-[180px] ml-auto">
          <SelectValue placeholder="Urutkan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-low">Harga Terendah</SelectItem>
          <SelectItem value="price-high">Harga Tertinggi</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
