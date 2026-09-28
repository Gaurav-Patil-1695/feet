/**
 * Service due status helpers derived from DashboardVehicleRow data.
 */

import type { DashboardVehicleRow } from "../types/dashboard";
import { daysFromToday } from "./formatDate";

/**
 * Status labels for service due state.
 */
export type ServiceDueStatusLabel = "Overdue" | "Due Soon" | "OK";

/**
 * Badge variant strings aligned with the Badge component's variant prop.
 */
export type ServiceDueStatusVariant = "danger" | "warning" | "success";

export interface ServiceDueStatus {
  label: ServiceDueStatusLabel;
  variant: ServiceDueStatusVariant;
}

/**
 * Number of days within which a vehicle is considered "Due Soon".
 */
const DUE_SOON_THRESHOLD_DAYS = 14;

/**
 * Derives the service due status label and badge variant from a DashboardVehicleRow.
 *
 * Logic:
 * - If next_service_date is in the past (or today with 0 days remaining) relative
 *   to today → "Overdue" / "danger"
 * - If next_service_date is within DUE_SOON_THRESHOLD_DAYS days from today → "Due Soon" / "warning"
 * - Otherwise → "OK" / "success"
 *
 * If no next_service_date is present, falls back to "OK" / "success".
 */
export function getServiceDueStatus(row: DashboardVehicleRow): ServiceDueStatus {
  const { next_service_date } = row;

  if (!next_service_date) {
    return { label: "OK", variant: "success" };
  }

  const days = daysFromToday(next_service_date);

  if (days === null) {
    return { label: "OK", variant: "success" };
  }

  if (days < 0) {
    return { label: "Overdue", variant: "danger" };
  }

  if (days <= DUE_SOON_THRESHOLD_DAYS) {
    return { label: "Due Soon", variant: "warning" };
  }

  return { label: "OK", variant: "success" };
}

/**
 * Returns just the status label for a DashboardVehicleRow.
 */
export function getServiceDueLabel(row: DashboardVehicleRow): ServiceDueStatusLabel {
  return getServiceDueStatus(row).label;
}

/**
 * Returns just the badge variant for a DashboardVehicleRow.
 */
export function getServiceDueVariant(row: DashboardVehicleRow): ServiceDueStatusVariant {
  return getServiceDueStatus(row).variant;
}
