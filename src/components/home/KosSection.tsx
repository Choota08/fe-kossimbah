import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { KosCard } from "@/components/KosCard";
import type { Kos } from "@/types/kos";

type Props = {
  kosList: Kos[];
  loading: boolean;
};

export const KosSection = ({ kosList, loading }: Props) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="font-serif text-3xl font-bold">
              Hasil Pencarian
            </h2>
            <p className="text-muted-foreground">
              Kos sesuai kata kunci Anda
            </p>
          </div>

          <Link to="/kos">
            <Button variant="outline-gold">Lihat Semua</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">
            Mencari kos...
          </p>
        ) : kosList.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Kos tidak ditemukan
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kosList.slice(0, 3).map((kos) => (
              <KosCard
                key={kos.id}
                id={kos.id}
                name={kos.name}
                location={kos.address}
                price={kos.price_per_month}
                facilities={kos.facilities.map(f => f.facility)}
                image={
                  kos.images.length > 0
                    ? `${import.meta.env.VITE_API_URL}/storage/${kos.images[0].file}`
                    : null
                }
                clickable
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
