export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

function looksConfigured(value: string) {
  return Boolean(value && !value.includes("example") && !value.includes("your-"));
}

export const isSupabaseConfigured =
  looksConfigured(supabaseUrl) && looksConfigured(supabaseAnonKey);

export const supabaseSetupMessage =
  "Supabase ist noch nicht konfiguriert. Setze NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY, damit Auth und Daten gespeichert werden.";
