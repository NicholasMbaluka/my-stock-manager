const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "KES";
const LOCALE = process.env.NEXT_PUBLIC_LOCALE ?? "en-KE";

/** Format a numeric amount as currency using the configured currency. */
export function formatCurrency(value: number): string {
  const amount = Number.isFinite(value) ? value : 0;
  try {
    return new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency: CURRENCY,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${CURRENCY} ${amount.toFixed(2)}`;
  }
}

/** Format a whole number with thousands separators. */
export function formatNumber(value: number): string {
  const amount = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat(LOCALE).format(amount);
}

/** Format a date/time value as a short, readable date. */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: "medium" }).format(
    new Date(date),
  );
}

/** Format a date/time value including the time of day. */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat(LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

/** Whether a date string falls on the current calendar day. */
export function isToday(date: string | Date): boolean {
  const value = new Date(date);
  const now = new Date();
  return (
    value.getFullYear() === now.getFullYear() &&
    value.getMonth() === now.getMonth() &&
    value.getDate() === now.getDate()
  );
}