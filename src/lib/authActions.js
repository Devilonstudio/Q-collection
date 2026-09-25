import { useContext } from "react";
import { AuthContext } from "./auth.jsx";
import { supabase } from "./supabase";

export function useAuth() {
  return useContext(AuthContext);
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}
