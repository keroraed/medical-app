import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { BACKEND_URL, ROLES } from "./constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function getProfilePicUrl(pic) {
  if (!pic) return null;
  if (pic.startsWith("http://") || pic.startsWith("https://")) return pic;
  return `${BACKEND_URL}${pic}`;
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const date =
    typeof dateString === "string" ? parseISO(dateString) : dateString;
  return format(date, "MMM dd, yyyy");
}

export function formatTime(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

export function getErrorMessage(error) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export function getDashboardPath(role) {
  switch (role) {
    case ROLES.ADMIN:
      return "/admin";
    case ROLES.DOCTOR:
      return "/doctor";
    case ROLES.PATIENT:
      return "/patient";
    default:
      return "/";
  }
}

/**
 * Robustly extract an ID string from various shapes:
 *   string, { _id }, { id }, ObjectId, etc.
 */
export function extractId(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value._id ?? value.id ?? (value.toString !== Object.prototype.toString ? value.toString() : null);
}

/**
 * Extract a display name from a user-like or participant-like object.
 * Tries: obj.name → obj.userId.name → obj.user.name → firstName+lastName
 */
export function extractName(obj) {
  if (!obj) return "Unknown";
  if (typeof obj === "string") return obj;

  // Direct name
  if (obj.name) return obj.name;

  // Nested via .userId (populated participant)
  const via = obj.userId ?? obj.user;
  if (via?.name) return via.name;

  // firstName / lastName
  const first = obj.firstName ?? via?.firstName ?? "";
  const last = obj.lastName ?? via?.lastName ?? "";
  const full = `${first} ${last}`.trim();
  if (full) return full;

  return "Unknown";
}
