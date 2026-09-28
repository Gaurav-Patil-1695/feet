/**
 * Role check helpers derived from a decoded JWT token payload.
 */

import type { DecodedToken } from "../types/auth";

/**
 * Returns true if the decoded token represents an admin user.
 */
export function isAdmin(token: DecodedToken | null | undefined): boolean {
  if (!token) return false;
  return token.role === "admin";
}

/**
 * Returns true if the decoded token represents a manager user.
 */
export function isManager(token: DecodedToken | null | undefined): boolean {
  if (!token) return false;
  return token.role === "manager";
}

/**
 * Returns true if the decoded token represents a technician user.
 */
export function isTechnician(token: DecodedToken | null | undefined): boolean {
  if (!token) return false;
  return token.role === "technician";
}

/**
 * Returns true if the decoded token has admin or manager privileges.
 */
export function isAdminOrManager(token: DecodedToken | null | undefined): boolean {
  return isAdmin(token) || isManager(token);
}
