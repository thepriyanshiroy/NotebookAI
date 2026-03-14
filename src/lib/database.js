import { supabase } from "./supabase";

// ─────────────────────────────────────────
// NOTEBOOKS
// ─────────────────────────────────────────

export async function getNotebooks() {
  const { data, error } = await supabase
    .from("notebooks")
    .select("*, sections(count)")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createNotebook({ title, subject, icon_color, emoji }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("notebooks")
    .insert([{ title, subject, icon_color, emoji, user_id: user.id }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNotebook(id) {
  const { error } = await supabase.from("notebooks").delete().eq("id", id);
  if (error) throw error;
}

export async function updateNotebook(id, updates) {
  const { data, error } = await supabase
    .from("notebooks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────

export async function getSections(notebookId) {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("notebook_id", notebookId)
    .order("position", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createSection({ notebook_id, title, position }) {
  // Also bump the notebook updated_at so dashboard shows recent changes
  await supabase
    .from("notebooks")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", notebook_id);

  const { data, error } = await supabase
    .from("sections")
    .insert([
      {
        notebook_id,
        title: title || "New Section",
        content: "",
        position: position ?? 0,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSection(id, { title, content }) {
  const { data, error } = await supabase
    .from("sections")
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSection(id) {
  const { error } = await supabase.from("sections").delete().eq("id", id);
  if (error) throw error;
}
