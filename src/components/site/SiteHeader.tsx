import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Search } from "lucide-react";

import { ARCHIVE_NAME } from "@/lib/archive";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/archive", label: "Archive" },
  { to: "/about", label: "About" },
] as const;

/** Public site navigation. Transparent over the hero, solid once scrolled. */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-12">
        <Link to="/" className="font-display text-2xl tracking-[0.35em] md:text-[1.6rem]">
          {ARCHIVE_NAME}
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="eyebrow transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/archive"
            search={{ q: "" }}
            className="flex items-center gap-2 eyebrow transition-colors hover:text-foreground"
            aria-label="Search the archive"
          >
            <Search className="h-3.5 w-3.5" />
            Search
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="eyebrow flex items-center gap-2 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          Menu
        </button>
      </div>

      {open && (
        <nav className="animate-fade border-t border-border bg-background/95 px-6 py-8 backdrop-blur-md md:hidden">
          <ul className="space-y-6">
            {[...NAV, { to: "/archive", label: "Search" }].map((item, i) => (
              <li key={`${item.to}-${i}`}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
