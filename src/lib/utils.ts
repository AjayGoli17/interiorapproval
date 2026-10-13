import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format amounts in Indian Rupee format (e.g. ₹18,00,000)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Compact Indian Rupee format (e.g. ₹18L, ₹3.2L, ₹45K, ₹1.8Cr)
 */
export function formatINRCompact(amount: number): string {
  if (isNaN(amount) || amount === 0) return "₹0";
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (abs >= 10000000) {
    const val = (abs / 10000000).toFixed(1).replace(/\.0$/, "");
    return `${sign}₹${val}Cr`;
  }
  if (abs >= 100000) {
    const val = (abs / 100000).toFixed(1).replace(/\.0$/, "");
    return `${sign}₹${val}L`;
  }
  if (abs >= 1000) {
    const val = (abs / 1000).toFixed(1).replace(/\.0$/, "");
    return `${sign}₹${val}k`;
  }
  return formatINR(amount);
}

/**
 * Format standard date strings
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}
