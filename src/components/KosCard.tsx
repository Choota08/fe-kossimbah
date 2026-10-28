import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Wifi, Wind, Bath } from "lucide-react";

export interface KosCardProps {
  id?: number; // ✅ FIX
  name?: string;
  location?: string;
  price?: number;
  facilities?: string[];
  image?: string | null;
  index?: number;
  clickable?: boolean;
}

const facilityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-3 h-3" />,
  AC: <Wind className="w-3 h-3" />,
  "Kamar Mandi Dalam": <Bath className="w-3 h-3" />,
};

export function KosCard({
  id,
  name,
  location,
  price,
  facilities = [],
  image,
  index = 0,
  clickable = false,
}: KosCardProps) {
  const formatPrice = (price?: number) =>
    price
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(price)
      : "-";

  const content = (
    <div className="group bg-card rounded-xl overflow-hidden shadow-md border hover:shadow-lg transition-all">
      <div className="relative aspect-[4/3] bg-muted">
        {image ? (
          <img
            src={image}
            alt={name || "Foto kos"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            Belum ada foto
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-serif font-semibold text-lg">
          {name || "Nama Kos"}
        </h3>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          {location || "Alamat belum diisi"}
        </div>

        <div className="flex flex-wrap gap-2">
          {facilities.slice(0, 3).map((f) => (
            <div
              key={f}
              className="flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded"
            >
              {facilityIcons[f]}
              {f}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t">
          <span className="text-gold font-bold text-lg">
            {formatPrice(price)}
          </span>
          <span className="text-sm text-muted-foreground"> /bulan</span>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {clickable && id ? <Link to={`/kos/${id}`}>{content}</Link> : content}
    </motion.div>
  );
}
