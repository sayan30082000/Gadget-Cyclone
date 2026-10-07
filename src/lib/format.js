// Bangladeshi grouping (1,50,000) with the "Tk" prefix used across the store.
export const tk = (n) => `Tk ${Math.round(n).toLocaleString("en-IN")}`;

export const cn = (...parts) => parts.filter(Boolean).join(" ");

/** Normalises a Bangladeshi mobile number to 01XXXXXXXXX, or returns null. */
export function normalizeBdPhone(raw) {
  const digits = String(raw).replace(/[\s()-]/g, "").replace(/^\+?88/, "");
  return /^01[3-9]\d{8}$/.test(digits) ? digits : null;
}
