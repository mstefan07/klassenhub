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
