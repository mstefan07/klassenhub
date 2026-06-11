import { Badge, type BadgeProps } from "@/components/ui/badge";

const statusVariant: Record<string, BadgeProps["variant"]> = {
  done: "success",
  active: "success",
  soon: "warning",
  overdue: "danger",
  missed: "danger",
  urgent: "danger",
  important: "warning",
  planned: "info",
  open: "info",
  in_progress: "warning",
  ended: "secondary",
  normal: "secondary",
};

export const STATUS_LABELS: Record<string, string> = {
  done: "Erledigt",
  active: "Aktiv",
  soon: "Bald",
  overdue: "Überfällig",
  missed: "Verpasst",
  urgent: "Dringend",
  important: "Wichtig",
  planned: "Geplant",
  open: "Offen",
  in_progress: "In Arbeit",
  ended: "Beendet",
  normal: "Normal",
};

export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label?: string;
}) {
  const resolvedLabel =
    label && label !== status ? label : (STATUS_LABELS[status] ?? label ?? status);

  return (
    <Badge withDot variant={statusVariant[status] ?? "secondary"}>
      {resolvedLabel}
    </Badge>
  );
}
