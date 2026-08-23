/**
 * Shared data helpers for the public archive.
 *
 * Photographs live in the `photos` table in Lovable Cloud.
 * Everyone may READ them; only the two administrator accounts may write
 * (that rule is enforced by the database, not by the UI).
 */
import { supabase } from "@/integrations/supabase/client";

export type Photo = {
  id: string;
  title: string;
  category: string;
  event_name: string | null;
  taken_on: string | null;
  description: string | null;
  image_url: string;
  width: number | null;
  height: number | null;
  featured: boolean;
  created_at: string;
};

/** The name shown across the site. Change it in this one place. */
export const ARCHIVE_NAME = "AARVI";

/** Categories offered in the admin form and as gallery filters. */
export const CATEGORIES = ["Events", "Photoshoots", "Red Carpet", "Editorial"] as const;

/** Fetch every photograph, newest / featured first. */
export async function fetchPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("taken_on", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Photo[];
}

/** Query key used by TanStack Query so admin edits can refresh the gallery. */
export const photosQueryKey = ["photos"] as const;

/** "2026-03-22" -> "22 March 2026" */
export function formatDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function yearOf(photo: Photo): string {
  return photo.taken_on ? photo.taken_on.slice(0, 4) : "";
}

/** Filter chips shown above the gallery: categories + the years we actually have. */
export function buildFilters(photos: Photo[]): string[] {
  const years = Array.from(new Set(photos.map(yearOf).filter(Boolean))).sort().reverse();
  return ["All", ...CATEGORIES, ...years];
}

export function matchesFilter(photo: Photo, filter: string): boolean {
  if (filter === "All") return true;
  if (/^\d{4}$/.test(filter)) return yearOf(photo) === filter;
  return photo.category === filter;
}

export function matchesSearch(photo: Photo, term: string): boolean {
  const q = term.trim().toLowerCase();
  if (!q) return true;
  return [photo.title, photo.category, photo.event_name, photo.description]
    .filter(Boolean)
    .some((field) => (field as string).toLowerCase().includes(q));
}
