import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  variant?: "hero" | "default";
  onSearch?: (keyword: string) => void;
}

export function SearchBar({
  variant = "default",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const submitSearch = () => {
    const keyword = query.trim();
    const loc = location.trim();

    // MODE CALLBACK (HeroSection)
    if (onSearch) {
      onSearch(keyword);
      return;
    }

    // MODE URL REDIRECT (KosPage)
    const params = new URLSearchParams();
    if (keyword) params.set("search", keyword);
    if (loc) params.set("location", loc);

    navigate(`/kos?${params.toString()}`);
  };

  const onEnter =
    (fn: () => void) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") fn();
    };

  /* =====================
     HERO VARIANT
     ===================== */
  if (variant === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="bg-card/95 backdrop-blur-md rounded-2xl p-2 shadow-luxury border border-border">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                placeholder="Cari nama kos atau tipe kamar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onEnter(submitSearch)}
                className="flex-1 bg-transparent border-none outline-none"
              />
            </div>

            <Button
              variant="hero"
              size="lg"
              onClick={submitSearch}
              className="md:w-auto w-full"
            >
              <Search className="w-5 h-5 mr-2" />
              Cari
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  /* =====================
     DEFAULT VARIANT
     ===================== */
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari kos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onEnter(submitSearch)}
          className="pl-10"
        />
      </div>

      <div className="flex-1 relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Lokasi"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={onEnter(submitSearch)}
          className="pl-10"
        />
      </div>

      <Button variant="gold" onClick={submitSearch}>
        <Search className="w-4 h-4 mr-2" />
        Cari
      </Button>
    </div>
  );
}
