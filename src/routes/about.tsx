import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useReveal } from "@/hooks/use-reveal";
import { ARCHIVE_NAME } from "@/lib/archive";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${ARCHIVE_NAME}` },
      {
        name: "description",
        content: `About the ${ARCHIVE_NAME} photographic archive — curation and credits.`,
      },
      { property: "og:title", content: `About — ${ARCHIVE_NAME}` },
      {
        property: "og:description",
        content: `About the ${ARCHIVE_NAME} photographic archive.`,
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  useReveal();

  return (
    <div className="min-h-screen">
      <SiteHeader solid />

      <section className="px-6 pt-40 md:px-12 md:pt-56">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="display animate-rise text-[clamp(3rem,10vw,8rem)]">About</h1>

          <p className="animate-fade mt-16 font-display text-3xl leading-snug md:mt-24 md:text-[2.8rem]">
            A permanent visual record of {ARCHIVE_NAME}'s work in front of the camera — editorial
            sittings, festival arrivals and quiet moments between takes.
          </p>

          <div className="reveal mt-20 grid gap-14 border-t border-border pt-14 md:mt-28 md:grid-cols-3">
            <div>
              <p className="eyebrow">Curation</p>
              <p className="mt-5 text-sm leading-loose text-muted-foreground">
                Each photograph is catalogued by category, event and year, and added by the
                archive's curators.
              </p>
            </div>
            <div>
              <p className="eyebrow">Credits</p>
              <ul className="mt-5 space-y-2 text-sm leading-loose text-muted-foreground">
                <li>Photography — credited per image</li>
                <li>Curation — archive team</li>
              </ul>
            </div>
            <div>
              <p className="eyebrow">Enquiries</p>
              <ul className="mt-5 space-y-2 text-sm leading-loose text-muted-foreground">
                {["Instagram", "Press"].map((label) => (
                  <li key={label}>
                    <a href="#" className="transition-colors hover:text-foreground">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
