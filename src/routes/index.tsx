import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PhotoGrid } from "@/components/site/PhotoGrid";
import { Lightbox } from "@/components/site/Lightbox";
import { useReveal } from "@/hooks/use-reveal";
import { ARCHIVE_NAME, fetchPhotos, photosQueryKey } from "@/lib/archive";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${ARCHIVE_NAME} — The Archive` },
      {
        name: "description",
        content: `The official photographic archive of ${ARCHIVE_NAME}: editorial sittings, red carpet arrivals and event photography, catalogued by year.`,
      },
      { property: "og:title", content: `${ARCHIVE_NAME} — The Archive` },
      {
        property: "og:description",
        content: `A cinematic archive of ${ARCHIVE_NAME}'s photography.`,
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: photos = [] } = useQuery({ queryKey: photosQueryKey, queryFn: fetchPhotos });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useReveal();

  const featured = photos.filter((p) => p.featured).slice(0, 6);
  const latest = photos.slice(0, 6);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO — visually dominant, full viewport */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        <img
          src="/samples/hero.jpg"
          alt={`${ARCHIVE_NAME} photographed in a darkened studio`}
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />

        <div className="relative flex h-full flex-col justify-end px-6 pb-20 md:px-12 md:pb-28">
          <p className="eyebrow animate-fade">Photography — 2024 to 2026</p>
          <h1 className="display animate-rise mt-6 text-[clamp(3.5rem,14vw,11rem)]">
            The Archive
          </h1>
          <div className="animate-rise mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              A permanent record of {ARCHIVE_NAME}'s work in front of the camera — editorial
              sittings, festival arrivals and quiet moments between takes.
            </p>
            <Link
              to="/archive"
              className="group inline-flex w-fit items-center gap-4 border-b border-accent pb-2 eyebrow text-accent transition-all hover:gap-6"
            >
              Explore Archive
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="px-6 py-28 md:px-12 md:py-40">
          <div className="reveal mx-auto max-w-[1600px]">
            <p className="eyebrow">Selected</p>
            <h2 className="display mt-4 text-5xl md:text-7xl">Featured Photographs</h2>
          </div>
          <div className="mx-auto mt-16 max-w-[1600px]">
            <PhotoGrid
              photos={featured}
              columns={3}
              onSelect={(i) => setLightboxIndex(photos.indexOf(featured[i]!))}
            />
          </div>
        </section>
      )}

      {/* LATEST COLLECTION */}
      <section className="border-t border-border px-6 py-28 md:px-12 md:py-40">
        <div className="reveal mx-auto flex max-w-[1600px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Most recent</p>
            <h2 className="display mt-4 text-5xl md:text-7xl">Latest Collection</h2>
          </div>
          <Link
            to="/archive"
            className="eyebrow w-fit border-b border-border pb-2 transition-colors hover:text-foreground"
          >
            View all photographs
          </Link>
        </div>
        <div className="mx-auto mt-16 max-w-[1600px]">
          <PhotoGrid
            photos={latest}
            columns={3}
            onSelect={(i) => setLightboxIndex(photos.indexOf(latest[i]!))}
          />
        </div>
      </section>

      <SiteFooter />

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
