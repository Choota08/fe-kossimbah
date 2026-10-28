import { motion } from "framer-motion";
import { Shield, Star, Clock, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Terpercaya & Aman",
    description: "Semua properti telah diverifikasi",
  },
  {
    icon: Star,
    title: "Kualitas Premium",
    description: "Properti dengan standar tinggi",
  },
  {
    icon: Clock,
    title: "Proses Cepat",
    description: "Booking instan dan mudah",
  },
  {
    icon: HeartHandshake,
    title: "Layanan 24/7",
    description: "Support kapan saja",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card p-6 rounded-xl shadow-md border"
          >
            <feature.icon className="w-6 h-6 text-gold mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
