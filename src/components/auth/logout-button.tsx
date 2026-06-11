"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = getBrowserSupabaseClient();

    if (supabase) {
      await supabase.auth.signOut();
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <Button type="button" variant="ghost" onClick={handleLogout}>
      <LogOut />
      Logout
    </Button>
  );
}
