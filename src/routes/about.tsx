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
        content: `About the ${ARCHIVE_NAME} photographic archive: how it is curated, catalogued and credited.`,
      },
      { property: "og:title", content: `About — ${ARCHIVE_NAME}` },
      {
        property: "og:description",
        content: `How the ${ARCHIVE_NAME} archive is curated and catalogued.`,
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  useReveal();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="px-6 pt-36 md:px-12 md:pt-48">
        <div className="mx-auto max-w-[1600px]">
          <p className="eyebrow animate-fade">About</p>
          <h1 className="display animate-rise mt-5 text-[clamp(3rem,10vw,8rem)]">
            {ARCHIVE_NAME}
          </h1>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-[1100px] gap-20">
          <div className="reveal">
            <p className="eyebrow">Biography</p>
            <p className="mt-6 font-display text-3xl leading-snug md:text-[2.6rem]">
              A short biography goes here — a few sentences on the work, the years covered and
              why this archive exists.
            </p>
            <p className="mt-8 max-w-2xl text-sm leading-loose text-muted-foreground">
              Replace this placeholder text with the real biography. Two or three paragraphs
              usually reads best on an editorial page like this one: an introduction, a note on
              notable work, and a closing line about the archive itself.
            </p>
          </div>

          <div className="reveal border-t border-border pt-14">
            <p className="eyebrow">The Archive</p>
            <p className="mt-6 max-w-2xl text-sm leading-loose text-muted-foreground">
              Every photograph is catalogued with a title, category, event name and date. The
              collection is organised into four categories — Events, Photoshoots, Red Carpet and
              Editorial — and can also be browsed by year. New material is added by the archive
              curators; high-resolution originals are held in secure cloud storage separately
              from this website.
            </p>
          </div>

          <div className="reveal grid gap-12 border-t border-border pt-14 md:grid-cols-2">
            <div>
              <p className="eyebrow">Credits</p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>Photography — individual credits per image</li>
                <li>Curation — archive team</li>
                <li>Design &amp; build — placeholder credit</li>
              </ul>
            </div>
            <div>
              <p className="eyebrow">Elsewhere</p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {["Instagram", "X", "Press enquiries"].map((label) => (
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
