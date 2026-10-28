import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Kos } from "@/types/kos";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import HeroSection from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { KosSection } from "@/components/home/KosSection";

const Index = () => {
  const [kosList, setKosList] = useState<Kos[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchKos = async (keyword?: string) => {
    try {
      setLoading(true);
      const res = await api.get("/kos", {
        params: keyword ? { search: keyword } : {},
      });

      setKosList(res.data?.data ?? []);
    } catch (error) {
      console.error("Gagal mengambil data kos:", error);
      setKosList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKos();
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO + SEARCH */}
      <HeroSection onSearch={fetchKos} />

      {/* FITUR */}
      <FeaturesSection />

      {/* LIST KOS */}
      <KosSection kosList={kosList} loading={loading} />

      <Footer />
    </>
  );
};

export default Index;
 