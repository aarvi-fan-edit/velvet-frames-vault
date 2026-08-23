import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import type { Photo } from "@/lib/archive";
import { formatDate } from "@/lib/archive";

type Props = {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

/**
 * Full-screen image viewer. Arrow keys and Escape work; metadata sits quietly
 * along the bottom edge rather than in a boxed dialog.
 */
export function Lightbox({ photos, index, onClose, onIndexChange }: Props) {
  const photo = photos[index];

  const go = (step: number) => {
    onIndexChange((index + step + photos.length) % photos.length);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  });

  if (!photo) return null;

  return (
    <div
      className="animate-fade fixed inset-0 z-50 flex flex-col bg-background/98 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
    >
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        <span className="eyebrow">
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="eyebrow flex items-center gap-2 transition-colors hover:text-foreground"
          aria-label="Close viewer"
        >
          Close <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 md:px-24">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photograph"
          className="absolute left-2 z-10 p-3 text-muted-foreground transition-colors hover:text-foreground md:left-6"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        <img
          key={photo.id}
          src={photo.image_url}
          alt={photo.title}
          className="animate-fade max-h-full max-w-full object-contain"
        />

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photograph"
          className="absolute right-2 z-10 p-3 text-muted-foreground transition-colors hover:text-foreground md:right-6"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>

      <div className="px-6 pb-10 pt-6 md:px-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 border-t border-border pt-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">{photo.title}</h2>
            {photo.description && (
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">{photo.description}</p>
            )}
          </div>
          <dl className="flex flex-wrap gap-x-10 gap-y-2 text-sm">
            <div>
              <dt className="eyebrow">Category</dt>
              <dd className="mt-1">{photo.category}</dd>
            </div>
            {photo.event_name && (
              <div>
                <dt className="eyebrow">Event</dt>
                <dd className="mt-1">{photo.event_name}</dd>
              </div>
            )}
            {photo.taken_on && (
              <div>
                <dt className="eyebrow">Date</dt>
                <dd className="mt-1">{formatDate(photo.taken_on)}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
