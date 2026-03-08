import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env";

// Inicializa o cliente Supabase para uso no backend
const supabaseUrl = ENV.supabaseUrl;
const supabaseAnonKey = ENV.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("SUPABASE_URL or SUPABASE_ANON_KEY is not set in environment variables.");
  throw new Error("Supabase credentials are not set.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
