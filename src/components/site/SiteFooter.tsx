import { Link } from "@tanstack/react-router";

import { ARCHIVE_NAME } from "@/lib/archive";

/** Deliberately quiet: a wordmark, three links, one line of small print. */
export function SiteFooter() {
  return (
    <footer className="px-6 pb-12 pt-24 md:px-12 md:pb-16 md:pt-32">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 border-t border-border pt-10 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="font-display text-lg tracking-[0.42em]">
          {ARCHIVE_NAME}
        </Link>

        <nav className="flex gap-8">
          {[
            { to: "/", label: "Home" },
            { to: "/archive", label: "Archive" },
            { to: "/about", label: "About" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="eyebrow transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {ARCHIVE_NAME} — all rights reserved
        </p>
      </div>
    </footer>
  );
}
