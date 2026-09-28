/**
 * Odometer value formatting helpers used across vehicle and work order views.
 */

/**
 * Formats an odometer value (in kilometres) to a locale-separated string with "km" suffix.
 * Example: 123456 => "123,456 km"
 */
export function formatOdometer(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "—";
  }
  return `${value.toLocaleString("en-GB")} km`;
}

/**
 * Formats an odometer value as a plain locale-separated number string without unit.
 * Example: 123456 => "123,456"
 */
export function formatOdometerValue(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "—";
  }
  return value.toLocaleString("en-GB");
}

/**
 * Formats the difference between two odometer readings as a signed km string.
 * Example: (150000, 123456) => "+26,544 km"
 */
export function formatOdometerDelta(
  current: number | null | undefined,
  previous: number | null | undefined
): string {
  if (current === null || current === undefined || previous === null || previous === undefined) {
    return "—";
  }
  const delta = current - previous;
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta.toLocaleString("en-GB")} km`;
}
