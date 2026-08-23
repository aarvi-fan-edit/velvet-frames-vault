import { Link } from "@tanstack/react-router";

import { ARCHIVE_NAME } from "@/lib/archive";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-20 md:px-12">
      <div className="mx-auto grid max-w-[1600px] gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl tracking-[0.3em]">{ARCHIVE_NAME}</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A curated photographic archive. Every frame catalogued by event, date and
            collection.
          </p>
        </div>

        <div>
          <p className="eyebrow">Navigate</p>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link to="/archive" className="transition-colors hover:text-foreground">
                Archive
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-foreground">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Elsewhere</p>
          {/* Placeholder links — replace the # with real profiles later. */}
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

      <div className="mx-auto mt-20 flex max-w-[1600px] flex-col gap-3 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {ARCHIVE_NAME}. All photographs are rights reserved.</p>
        <p>Images shown are placeholders for the prototype.</p>
      </div>
    </footer>
  );
}
