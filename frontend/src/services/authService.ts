import { supabase } from "../config/supabase.ts";

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// ─── Sign Up ───────────────────────────────────────────────
export async function signUp({ name, email, password }: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name },
    },
  });
  if (error) throw error;
  return data;
}

// ─── Login ─────────────────────────────────────────────────
export async function login({ email, password }: LoginData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// ─── Logout ────────────────────────────────────────────────
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ─── Get current session ───────────────────────────────────
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// ─── Save aura selection to user profile ──────────────────
export async function saveAuraSelection(auraId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    aura_id: auraId,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

// ─── Get user profile ──────────────────────────────────────
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}
