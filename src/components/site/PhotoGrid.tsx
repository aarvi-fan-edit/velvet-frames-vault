import { useState } from "react";

import type { Photo } from "@/lib/archive";
import { yearOf } from "@/lib/archive";

type Props = {
  photos: Photo[];
  onSelect: (index: number) => void;
  /** Number of masonry columns on the widest screens. */
  columns?: 2 | 3 | 4;
};

/**
 * Repeating aspect-ratio rhythm used when a photograph has no stored
 * dimensions, so the masonry mixes portrait, landscape and square frames.
 */
const ASPECTS = ["2 / 3", "4 / 3", "1 / 1", "3 / 4", "3 / 2", "4 / 5"] as const;

function aspectOf(photo: Photo, index: number): string {
  if (photo.width && photo.height) return `${photo.width} / ${photo.height}`;
  return ASPECTS[index % ASPECTS.length]!;
}

/**
 * True masonry gallery built with CSS columns — the photographs set the
 * rhythm, the interface stays out of the way.
 */
export function PhotoGrid({ photos, onSelect, columns = 3 }: Props) {
  const columnClass =
    columns === 4
      ? "sm:columns-2 lg:columns-3 2xl:columns-4"
      : columns === 2
        ? "sm:columns-2"
        : "sm:columns-2 lg:columns-3";

  return (
    <div className={`columns-1 gap-3 md:gap-5 ${columnClass}`}>
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          aspect={aspectOf(photo, index)}
          onClick={() => onSelect(index)}
          priority={index < 3}
        />
      ))}
    </div>
  );
}

function PhotoCard({
  photo,
  aspect,
  onClick,
  priority,
}: {
  photo: Photo;
  aspect: string;
  onClick: () => void;
  priority: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const year = yearOf(photo);

  return (
    <button
      type="button"
      onClick={onClick}
      className="reveal group mb-3 block w-full cursor-pointer overflow-hidden text-left md:mb-5"
      aria-label={`Open ${photo.title}`}
    >
      <div className="relative overflow-hidden bg-secondary" style={{ aspectRatio: aspect }}>
        <img
          src={photo.image_url}
          alt={photo.title}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`h-full w-full object-cover transition-[opacity,transform] duration-[1600ms] ease-out group-hover:scale-[1.03] ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Minimal hover metadata: category · event · year */}
        <div className="pointer-events-none absolute inset-0 bg-background/45 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100 md:p-6">
          <p className="eyebrow text-foreground/90">
            {[photo.category, photo.event_name, year].filter(Boolean).join("  ·  ")}
          </p>
        </div>
      </div>
    </button>
  );
}
