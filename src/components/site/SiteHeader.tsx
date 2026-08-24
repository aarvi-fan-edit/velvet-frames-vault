import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ARCHIVE_NAME } from "@/lib/archive";

const NAV = [
  { to: "/", label: "Home", index: "01" },
  { to: "/archive", label: "Archive", index: "02" },
  { to: "/about", label: "About", index: "03" },
] as const;

/**
 * Minimal site chrome: wordmark on the left, MENU on the right.
 * The menu opens a quiet fullscreen navigation overlay.
 */
export function SiteHeader({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-700 ${
          (scrolled || solid) && !open ? "bg-background/70 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="flex h-[4.5rem] items-center justify-between px-6 md:h-24 md:px-12">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="font-display text-xl leading-none tracking-[0.42em] md:text-2xl"
          >
            {ARCHIVE_NAME}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="eyebrow relative z-50 py-2 transition-colors hover:text-foreground"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {/* Fullscreen navigation */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-opacity duration-700 ease-out ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex h-full flex-col justify-center px-6 md:px-12">
          <ul className="mx-auto w-full max-w-[1600px]">
            {NAV.map((item, i) => (
              <li
                key={item.to}
                className="overflow-hidden border-b border-border first:border-t"
                style={{ transitionDelay: `${120 + i * 80}ms` }}
              >
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`group flex items-baseline gap-6 py-6 transition-[opacity,transform] duration-700 ease-out md:py-10 ${
                    open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: `${120 + i * 90}ms` }}
                >
                  <span className="eyebrow w-10 shrink-0">{item.index}</span>
                  <span className="display text-[clamp(2.5rem,9vw,7rem)] transition-colors duration-500 group-hover:text-accent">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p
            className={`mx-auto mt-14 w-full max-w-[1600px] text-xs leading-relaxed text-muted-foreground transition-opacity duration-1000 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            {ARCHIVE_NAME} — photographic archive
          </p>
        </nav>
      </div>
    </>
  );
}
