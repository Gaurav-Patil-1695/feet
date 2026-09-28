/**
 * Date formatting helpers used across vehicle and work order views.
 */

/**
 * Formats an ISO date string or Date object to a human-readable short date.
 * Example: "Jan 15, 2024"
 */
export function formatDate(value: string | Date | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formats an ISO date string or Date object to a short date without the year.
 * Example: "15 Jan"
 */
export function formatShortDate(value: string | Date | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

/**
 * Formats an ISO date string or Date object to a full date and time.
 * Example: "15 Jan 2024, 09:30"
 */
export function formatDateTime(value: string | Date | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Formats an ISO date string or Date object to an ISO date-only string.
 * Example: "2024-01-15"
 */
export function formatISODate(value: string | Date | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns the number of days between today and a future date.
 * Positive = days remaining, negative = days overdue.
 */
export function daysFromToday(value: string | Date | null | undefined): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) {
    return null;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns a relative label such as "In 3 days", "Today", or "3 days ago".
 */
export function formatRelativeDays(value: string | Date | null | undefined): string {
  const days = daysFromToday(value);
  if (days === null) {
    return "—";
  }
  if (days === 0) {
    return "Today";
  }
  if (days > 0) {
    return `In ${days} day${days === 1 ? "" : "s"}`;
  }
  const abs = Math.abs(days);
  return `${abs} day${abs === 1 ? "" : "s"} ago`;
}
