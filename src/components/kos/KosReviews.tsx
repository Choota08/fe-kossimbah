import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types/review";

interface Props {
  reviews: Review[];
  reviewText: string;
  setReviewText: (v: string) => void;
  onSubmit: () => void;
}

export function KosReviews({
  reviews,
  reviewText,
  setReviewText,
  onSubmit,
}: Props) {
  return (
    <>
      {/* REVIEW FORM */}
      <div className="bg-secondary p-4 rounded-lg space-y-4">
        <h3 className="font-semibold">Tulis Review</h3>
        <Textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Bagikan pengalaman Anda"
        />
        <Button onClick={onSubmit}>Kirim Review</Button>
      </div>

      {/* REVIEW LIST */}
      <div className="space-y-4">
        <h3 className="font-semibold">Review Pengunjung</h3>

        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada review
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card p-4 rounded-lg"
            >
              <p className="font-semibold">
                {review.user.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
