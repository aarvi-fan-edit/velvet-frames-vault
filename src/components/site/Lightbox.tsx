import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import type { Photo } from "@/lib/archive";
import { yearOf } from "@/lib/archive";

type Props = {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

/**
 * Fullscreen photography viewer: near-black, image-first, minimal metadata.
 * Keyboard (← → Esc) and touch swipe both navigate.
 */
export function Lightbox({ photos, index, onClose, onIndexChange }: Props) {
  const photo = photos[index];
  const [loaded, setLoaded] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = (step: number) => {
    setLoaded(false);
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

  const meta = [photo.category, photo.event_name, yearOf(photo)].filter(Boolean).join("  ·  ");

  return (
    <div
      className="animate-fade fixed inset-0 z-[60] flex flex-col bg-[oklch(0.05_0_0)]"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        if (start == null || end == null) return;
        if (Math.abs(end - start) > 50) go(end < start ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <span className="eyebrow">
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="eyebrow flex items-center gap-2 py-1 transition-colors hover:text-foreground"
          aria-label="Close viewer"
        >
          <span className="hidden sm:inline">Close</span>
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-3 md:px-20">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photograph"
          className="absolute left-0 z-10 hidden p-4 text-muted-foreground transition-colors hover:text-foreground md:block"
        >
          <ChevronLeft className="h-8 w-8 stroke-1" />
        </button>

        <img
          key={photo.id}
          src={photo.image_url}
          alt={photo.title}
          onLoad={() => setLoaded(true)}
          className={`max-h-full max-w-full object-contain transition-opacity duration-[900ms] ease-out ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photograph"
          className="absolute right-0 z-10 hidden p-4 text-muted-foreground transition-colors hover:text-foreground md:block"
        >
          <ChevronRight className="h-8 w-8 stroke-1" />
        </button>
      </div>

      <div className="px-5 pb-8 pt-5 md:px-10 md:pb-12">
        <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-6">
          <div className="min-w-0">
            <h2 className="display truncate text-2xl md:text-3xl">{photo.title}</h2>
            {meta && <p className="eyebrow mt-2">{meta}</p>}
          </div>

          {/* Touch-friendly controls on small screens */}
          <div className="flex shrink-0 gap-6 md:hidden">
            <button type="button" onClick={() => go(-1)} aria-label="Previous photograph">
              <ChevronLeft className="h-6 w-6 stroke-1 text-muted-foreground" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photograph">
              <ChevronRight className="h-6 w-6 stroke-1 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
