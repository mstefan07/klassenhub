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

export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label?: string;
}) {
  return (
    <Badge variant={statusVariant[status] ?? "secondary"}>
      {label ?? status}
    </Badge>
  );
}
