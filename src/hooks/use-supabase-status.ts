"use client";

import {
  isSupabaseConfigured,
  supabaseSetupMessage,
} from "@/lib/supabase/config";

export function useSupabaseStatus() {
  return {
    isConfigured: isSupabaseConfigured,
    message: supabaseSetupMessage,
  };
}
