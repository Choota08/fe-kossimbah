import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { KosFilterBar } from "@/components/kos/KosFilterBar";
import { KosList } from "@/components/kos/KosList";

import { useKosQuery } from "@/hooks/useKosQuery";

const DEFAULT_SORT = "price-low";

const KosPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /* =====================
     READ PARAMS (URL)
     ===================== */
  const search = searchParams.get("search") ?? "";
  const location = searchParams.get("location") ?? "";
  const sort = searchParams.get("sort") ?? DEFAULT_SORT;

  /* =====================
     DATA FETCH
     ===================== */
  const {
    data: kosList = [],
    isLoading,
    isError,
  } = useKosQuery({
    search,
    location,
    sort,
  });

  /* =====================
     HANDLERS
     ===================== */
  const updateParam = (key: string, value?: string) => {
    const next = new URLSearchParams(searchParams);

    if (!value || value === "Semua") {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setSearchParams(next);
  };

  /* =====================
     RENDER
     ===================== */
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-serif text-3xl font-bold">
              Cari <span className="text-gold">Kos</span>
            </h1>
            <p className="text-muted-foreground">
              Temukan kos terbaik sesuai kebutuhan Anda
            </p>
          </motion.div>

          {/* SEARCH */}
          <SearchBar />

          {/* FILTER & SORT */}
          <KosFilterBar
            location={location}
            setLocation={(value) => updateParam("location", value)}
            sort={sort}
            setSort={(value) => updateParam("sort", value)}
          />

          {/* RESULT */}
          {isLoading && (
            <p className="text-center text-muted-foreground">
              Memuat data kos...
            </p>
          )}

          {isError && (
            <p className="text-center text-red-500">
              Gagal memuat data kos
            </p>
          )}

          {!isLoading && !isError && <KosList kosList={kosList} />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default KosPage;
