import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabaseSetupMessage } from "@/lib/supabase/config";

export function SupabaseSetupNotice() {
  return (
    <Card className="border-warning/40 bg-warning/10 p-4 text-sm text-foreground shadow-none">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" />
        <div>
          <p className="font-semibold">Supabase Setup erforderlich</p>
          <p className="mt-1 text-muted-foreground">{supabaseSetupMessage}</p>
        </div>
      </div>
    </Card>
  );
}
