const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function isDateOnly(value: string) {
  return dateOnlyPattern.test(value);
}

export function parseDate(value: string, time?: string | null) {
  if (isDateOnly(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const [hours = 0, minutes = 0] = time?.split(":").map(Number) ?? [];

    return new Date(year, month - 1, day, hours, minutes);
  }

  return new Date(value);
}

export function endOfDate(value: string) {
  if (isDateOnly(value)) {
    const [year, month, day] = value.split("-").map(Number);

    return new Date(year, month - 1, day, 23, 59, 59, 999);
  }

  return new Date(value);
}

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
}

const shortDateFormatter = new Intl.DateTimeFormat("de-DE", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export type DueDateTone = "overdue" | "today" | "soon" | "normal";

/**
 * Formatiert ein Datum nutzerfreundlich relativ zu heute:
 * „3 Tage überfällig", „Heute", „Morgen", „Fr., 13. Juni".
 */
export function formatRelativeDate(
  value: string,
  now: Date = new Date(),
): { label: string; tone: DueDateTone } {
  const target = parseDate(value);

  if (Number.isNaN(target.getTime())) {
    return { label: value, tone: "normal" };
  }

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );
  const diffDays = Math.round(
    (startOfTarget.getTime() - startOfToday.getTime()) / 86_400_000,
  );

  if (diffDays < 0) {
    const days = Math.abs(diffDays);

    return {
      label: days === 1 ? "Gestern" : `${days} Tage überfällig`,
      tone: "overdue",
    };
  }

  if (diffDays === 0) {
    return { label: "Heute", tone: "today" };
  }

  if (diffDays === 1) {
    return { label: "Morgen", tone: "soon" };
  }

  if (diffDays <= 3) {
    return { label: `In ${diffDays} Tagen`, tone: "soon" };
  }

  return { label: shortDateFormatter.format(target), tone: "normal" };
}
