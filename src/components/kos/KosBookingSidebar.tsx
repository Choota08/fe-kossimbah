import { Button } from "@/components/ui/button";

interface Props {
  price: number;
  startDate: string;
  setStartDate: (v: string) => void;
  isOccupied: boolean;
  bookingLoading: boolean;
  onBook: () => void;
}

export function KosBookingSidebar({
  price,
  startDate,
  setStartDate,
  isOccupied,
  bookingLoading,
  onBook,
}: Props) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const bookingDisabled = bookingLoading || isOccupied;

  const bookingLabel = isOccupied
    ? "Kos Sudah Terisi"
    : bookingLoading
    ? "Memproses..."
    : "Booking Sekarang";

  return (
    <div className="sticky top-24 bg-card p-6 rounded-xl space-y-4">
      <div className="text-3xl font-bold text-gold">
        {formatPrice(price)}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tanggal Masuk</label>
        <input
          type="date"
          value={startDate}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={isOccupied}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Check-in mulai pukul <b>10.00 WIB</b>
        </p>
      </div>

      {isOccupied && (
        <p className="text-sm text-red-500">
          Kos ini sedang terisi
        </p>
      )}

      <Button
        disabled={bookingDisabled}
        onClick={onBook}
        className="w-full"
      >
        {bookingLabel}
      </Button>
    </div>
  );
}
