import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import {
  ARCHIVE_NAME,
  CATEGORIES,
  fetchPhotos,
  formatDate,
  photosQueryKey,
  type Photo,
} from "@/lib/archive";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: `Admin — ${ARCHIVE_NAME}` },
      { name: "description", content: "Private archive management dashboard." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Admin — ${ARCHIVE_NAME}` },
      { property: "og:description", content: "Private archive management dashboard." },
    ],
  }),
  component: AdminPage,
});

/** A signed URL valid for ~10 years, so private storage files can be displayed. */
const SIGNED_URL_TTL = 60 * 60 * 24 * 3650;

type Draft = {
  title: string;
  category: string;
  event_name: string;
  taken_on: string;
  description: string;
  featured: boolean;
};

const emptyDraft: Draft = {
  title: "",
  category: CATEGORIES[0],
  event_name: "",
  taken_on: "",
  description: "",
  featured: false,
};

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: photos = [] } = useQuery({ queryKey: photosQueryKey, queryFn: fetchPhotos });

  /**
   * Only the two allow-listed accounts can read `admin_emails`, so an empty
   * result means this signed-in user is not an administrator.
   */
  const { data: isAdmin, isLoading: checkingRole } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admin_emails").select("email").limit(1);
      if (error) return false;
      return (data ?? []).length > 0;
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editing, setEditing] = useState<Photo | null>(null);

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: photosQueryKey });
  };

  /** Upload one or more files to cloud storage, then create a row per file. */
  const upload = useMutation({
    mutationFn: async () => {
      for (const file of files) {
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.replace(/[^\w.-]/g, "_")}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(path, file, { cacheControl: "31536000" });
        if (uploadError) throw uploadError;

        const { data: signed, error: signError } = await supabase.storage
          .from("photos")
          .createSignedUrl(path, SIGNED_URL_TTL);
        if (signError || !signed) throw signError ?? new Error("Could not link the file");

        const { error: insertError } = await supabase.from("photos").insert({
          title: draft.title || file.name.replace(/\.[^.]+$/, ""),
          category: draft.category,
          event_name: draft.event_name || null,
          taken_on: draft.taken_on || null,
          description: draft.description || null,
          featured: draft.featured,
          image_url: signed.signedUrl,
        });
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      toast.success(`${files.length} photograph(s) added`);
      setFiles([]);
      setDraft(emptyDraft);
      refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const save = useMutation({
    mutationFn: async (photo: Photo) => {
      const { error } = await supabase
        .from("photos")
        .update({
          title: photo.title,
          category: photo.category,
          event_name: photo.event_name,
          taken_on: photo.taken_on || null,
          description: photo.description,
          featured: photo.featured,
        })
        .eq("id", photo.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Photograph updated");
      setEditing(null);
      refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("photos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Photograph deleted");
      refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  if (checkingRole) {
    return <p className="p-10 text-sm text-muted-foreground">Checking access…</p>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md p-10">
        <h1 className="font-display text-3xl">Not authorised</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This account is not on the archive's administrator list.
        </p>
        <button type="button" onClick={signOut} className="eyebrow mt-8 border border-border px-4 py-2">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-5">
        <div>
          <p className="eyebrow">{ARCHIVE_NAME} · Admin</p>
          <h1 className="mt-1 text-lg font-semibold">Archive dashboard</h1>
        </div>
        <button type="button" onClick={signOut} className="eyebrow border border-border px-4 py-2">
          Sign out
        </button>
      </header>

      <div className="grid gap-10 p-6 lg:grid-cols-[380px_1fr]">
        {/* ---------------- Upload panel ---------------- */}
        <section className="h-fit border border-border p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest">Upload photographs</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Select one or more files. The details below are applied to all of them and can be
            edited individually afterwards.
          </p>

          <div className="mt-6 space-y-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className="w-full text-xs file:mr-3 file:border file:border-border file:bg-secondary file:px-3 file:py-2 file:text-xs"
            />

            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {files.map((file) => (
                  <img
                    key={file.name}
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="aspect-square w-full object-cover"
                  />
                ))}
              </div>
            )}

            <Field label="Title">
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Defaults to the file name"
                className={inputClass}
              />
            </Field>

            <Field label="Category">
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-background">
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Event name">
              <input
                value={draft.event_name}
                onChange={(e) => setDraft({ ...draft, event_name: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Date">
              <input
                type="date"
                value={draft.taken_on}
                onChange={(e) => setDraft({ ...draft, taken_on: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Description">
              <textarea
                rows={2}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className={inputClass}
              />
            </Field>

            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
              />
              Show on the home page
            </label>

            <button
              type="button"
              disabled={files.length === 0 || upload.isPending}
              onClick={() => upload.mutate()}
              className="eyebrow w-full border border-accent py-3 text-accent transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
            >
              {upload.isPending ? "Uploading…" : `Upload ${files.length || ""}`}
            </button>
          </div>
        </section>

        {/* ---------------- Existing photographs ---------------- */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest">
            Photographs ({photos.length})
          </h2>

          <div className="mt-6 space-y-3">
            {photos.map((photo) => (
              <article key={photo.id} className="border border-border p-3">
                <div className="flex gap-4">
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    loading="lazy"
                    className="h-24 w-24 flex-none object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{photo.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {photo.category}
                      {photo.event_name ? ` · ${photo.event_name}` : ""}
                      {photo.taken_on ? ` · ${formatDate(photo.taken_on)}` : ""}
                      {photo.featured ? " · Featured" : ""}
                    </p>
                    <div className="mt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setEditing(editing?.id === photo.id ? null : photo)}
                        className="eyebrow border border-border px-3 py-1"
                      >
                        {editing?.id === photo.id ? "Cancel" : "Edit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete "${photo.title}"?`)) remove.mutate(photo.id);
                        }}
                        className="eyebrow border border-border px-3 py-1 text-destructive"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {editing?.id === photo.id && (
                  <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
                    <Field label="Title">
                      <input
                        value={editing.title}
                        onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Category">
                      <select
                        value={editing.category}
                        onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                        className={inputClass}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c} className="bg-background">
                            {c}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Event name">
                      <input
                        value={editing.event_name ?? ""}
                        onChange={(e) => setEditing({ ...editing, event_name: e.target.value })}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Date">
                      <input
                        type="date"
                        value={editing.taken_on ?? ""}
                        onChange={(e) => setEditing({ ...editing, taken_on: e.target.value })}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Description">
                      <textarea
                        rows={2}
                        value={editing.description ?? ""}
                        onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                        className={inputClass}
                      />
                    </Field>
                    <label className="flex items-end gap-2 pb-2 text-xs">
                      <input
                        type="checkbox"
                        checked={editing.featured}
                        onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                      />
                      Featured on home page
                    </label>
                    <button
                      type="button"
                      onClick={() => save.mutate(editing)}
                      className="eyebrow border border-accent px-4 py-2 text-accent sm:col-span-2"
                    >
                      {save.isPending ? "Saving…" : "Save changes"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const inputClass =
  "mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-accent";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      {children}
    </label>
  );
}
