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
        content: `The photographic archive of ${ARCHIVE_NAME}: editorial sittings, red carpet arrivals and event photography.`,
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

  const featured = photos.filter((p) => p.featured);
  const selection = (featured.length > 0 ? featured : photos).slice(0, 9);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO — the photograph is the page */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        <img
          src="/samples/hero.jpg"
          alt={`${ARCHIVE_NAME} photographed in a darkened studio`}
          className="animate-kenburns absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/15 to-background" />

        <div className="relative flex h-full flex-col justify-end px-6 pb-16 md:px-12 md:pb-20">
          <h1 className="display animate-rise text-[clamp(3.5rem,15vw,12rem)]">The Archive</h1>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="animate-fade max-w-xs text-sm leading-relaxed text-muted-foreground">
              Photography of {ARCHIVE_NAME}.
            </p>
            <Link
              to="/archive"
              className="animate-fade eyebrow w-fit border-b border-accent pb-2 text-accent transition-colors hover:text-foreground"
            >
              Enter
            </Link>
          </div>
        </div>
      </section>

      {/* SELECTED WORK — images only, no headings competing with them */}
      <section className="px-3 py-16 md:px-5 md:py-24">
        <div className="mx-auto max-w-[1800px]">
          <PhotoGrid
            photos={selection}
            columns={3}
            onSelect={(i) => setLightboxIndex(photos.indexOf(selection[i]!))}
          />
        </div>

        <div className="reveal mx-auto mt-16 flex max-w-[1800px] justify-center md:mt-24">
          <Link
            to="/archive"
            className="eyebrow border-b border-border pb-2 transition-colors hover:text-foreground"
          >
            View the full archive
          </Link>
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
