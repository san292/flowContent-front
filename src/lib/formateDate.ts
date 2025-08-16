// src/lib/formatDate.ts
export function formatDateUTC(input?: string | number | Date, locale = "fr-FR") {
  if (!input) return "";
  const d = new Date(input);

  // Essaye Intl avec dateStyle (si dispo)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fmt = new (Intl as any).DateTimeFormat(locale, {
      dateStyle: "long",
      timeZone: "UTC",
    });
    return fmt.format(d);
  } catch {
    // Fallback sans Intl/dateStyle
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy}`;
  }
}
