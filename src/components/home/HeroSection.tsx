import { motion } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";

type HeroSectionProps = {
  onSearch: (keyword: string) => void;
};

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <img
          src="/image/Livingroom4.jpg"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Temukan <span className="text-gold">Kos Impian</span> Anda
          </h1>
          <p className="text-lg md:text-xl text-white/80">
            Platform penyewaan kos terpercaya di seluruh Indonesia
          </p>
        </motion.div>

        <SearchBar variant="hero" onSearch={onSearch} />
      </div>
    </section>
  );
};

export default HeroSection;
