import { KosCard } from "@/components/KosCard";
import type { Kos } from "@/types/kos";

type KosListProps = {
  kosList: Kos[];
};

export const KosList = ({ kosList }: KosListProps) => {
  if (!kosList || kosList.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-16">
        Tidak ada kos yang sesuai 😕
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kosList.map((kos, index) => (
        <KosCard
          key={kos.id}
          id={kos.id}
          name={kos.name}
          location={kos.address}
          price={kos.price_per_month}
          facilities={kos.facilities?.map((f) => f.facility) ?? []}
          image={
            kos.images?.[0]?.file
              ? `${import.meta.env.VITE_API_URL}/storage/${kos.images[0].file}`
              : null
          }
          index={index}
          clickable
        />
      ))}
    </div>
  );
};
