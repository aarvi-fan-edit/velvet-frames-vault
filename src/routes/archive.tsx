import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PhotoGrid } from "@/components/site/PhotoGrid";
import { Lightbox } from "@/components/site/Lightbox";
import { useReveal } from "@/hooks/use-reveal";
import {
  ARCHIVE_NAME,
  buildFilters,
  fetchPhotos,
  matchesFilter,
  matchesSearch,
  photosQueryKey,
} from "@/lib/archive";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: `Archive — ${ARCHIVE_NAME}` },
      {
        name: "description",
        content:
          "Browse the complete photographic archive: events, photoshoots, red carpet and editorial work, filterable by category and year.",
      },
      { property: "og:title", content: `Archive — ${ARCHIVE_NAME}` },
      {
        property: "og:description",
        content: "The complete photographic archive, filterable by category and year.",
      },
    ],
  }),
  component: ArchivePage,
});

function ArchivePage() {
  const { data: photos = [], isLoading } = useQuery({
    queryKey: photosQueryKey,
    queryFn: fetchPhotos,
  });

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useReveal();

  const filters = useMemo(() => buildFilters(photos), [photos]);
  const visible = useMemo(
    () => photos.filter((p) => matchesFilter(p, filter) && matchesSearch(p, search)),
    [photos, filter, search],
  );

  return (
    <div className="min-h-screen">
      <SiteHeader solid />

      <section className="px-6 pt-36 md:px-12 md:pt-48">
        <div className="mx-auto max-w-[1800px]">
          <h1 className="display animate-rise text-[clamp(3rem,10vw,8rem)]">Archive</h1>
        </div>

        {/* Filters + search */}
        <div
          id="search"
          className="mx-auto mt-12 flex max-w-[1800px] flex-col gap-6 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="scrollbar-none -mx-1 flex gap-x-7 gap-y-3 overflow-x-auto px-1 lg:flex-wrap lg:overflow-visible">
            {filters.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setFilter(name)}
                className={`eyebrow shrink-0 pb-1 transition-colors duration-500 ${
                  filter === name ? "text-accent" : "hover:text-foreground"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full max-w-[14rem] border-b border-border bg-transparent pb-2 text-sm outline-none placeholder:text-muted-foreground focus:border-accent"
            aria-label="Search photographs"
          />
        </div>
      </section>

      <section className="px-3 py-10 md:px-5 md:py-16">
        <div className="mx-auto max-w-[1800px]">
          {isLoading ? (
            <p className="eyebrow">Loading archive…</p>
          ) : visible.length === 0 ? (
            <p className="py-24 text-center font-display text-3xl text-muted-foreground">
              No photographs match this selection.
            </p>
          ) : (
            <PhotoGrid
              photos={visible}
              columns={4}
              onSelect={(i) => setLightboxIndex(i)}
            />
          )}
        </div>
      </section>

      <SiteFooter />

      {lightboxIndex !== null && (
        <Lightbox
          photos={visible}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
