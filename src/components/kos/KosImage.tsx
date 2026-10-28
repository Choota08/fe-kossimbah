import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Props {
  images: string[];
  name: string;
}

export function KosImage({ images, name }: Props) {
  const [current, setCurrent] = useState(0);

  const next = () =>
    setCurrent((prev) => (prev + 1) % images.length);

  const prev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <motion.div className="relative aspect-video rounded-xl overflow-hidden">
      <img
        src={images[current]}
        alt={name}
        className="w-full h-full object-cover"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2
                       bg-black/40 text-white p-2 rounded-full"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2
                       bg-black/40 text-white p-2 rounded-full"
          >
            <ChevronRight />
          </button>
        </>
      )}
    </motion.div>
  );
}
