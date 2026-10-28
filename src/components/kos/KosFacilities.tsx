import {
  Wifi,
  Wind,
  Bath,
  Tv,
  Car,
  Utensils,
} from "lucide-react";

interface Facility {
  id: number;
  facility: string;
}

interface Props {
  facilities: Facility[];
}

const facilityIcons: Record<string, JSX.Element> = {
  WiFi: <Wifi className="w-4 h-4" />,
  AC: <Wind className="w-4 h-4" />,
  "Kamar Mandi Dalam": <Bath className="w-4 h-4" />,
  "Kamar Mandi Bersama": <Bath className="w-4 h-4" />,
  TV: <Tv className="w-4 h-4" />,
  Parkir: <Car className="w-4 h-4" />,
  Dapur: <Utensils className="w-4 h-4" />,
};

export function KosFacilities({ facilities }: Props) {
  if (facilities.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {facilities.map((f) => (
        <div
          key={f.id}
          className="flex items-center gap-2 text-sm"
        >
          {facilityIcons[f.facility] ?? null}
          <span>{f.facility}</span>
        </div>
      ))}
    </div>
  );
}
