import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Warn during development instead of throwing so the app can still render for debugging
  // and so you can work without immediately needing a Supabase project.
  // If you need full auth/DB features, create a .env file with the keys.
  // .env (local only, do NOT commit):
  // VITE_SUPABASE_URL=https://your-project.supabase.co
  // VITE_SUPABASE_ANON_KEY=eyJ....
  console.warn(
    "Supabase env vars not set. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
