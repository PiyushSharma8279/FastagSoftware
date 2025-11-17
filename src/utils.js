// helper utilities

// returns next tag for today's date in format YYYY-XXX (count padded to 3 digits).
// It inspects the existing companies list to determine the next counter for today.
export function generateNextTagForDate(companies) {
  // companies: array of companies
  const d = new Date();
  const year = d.getFullYear();
  // build base: e.g. "2025"
  const base = String(year);

  // collect existing tags that start with base-
  const allTags = (companies || []).flatMap((c) => (c.items || []).map((it) => it.tag));

  // find tags that match ^YYYY-### and extract counts
  const regex = new RegExp(`^${base}-(\\d{3})$`);
  let max = 0;
  for (const t of allTags) {
    const m = t.match(regex);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!Number.isNaN(n) && n > max) max = n;
    }
  }
  const next = (max || 0) + 1;
  return `${base}-${String(next).padStart(3, "0")}`;
}
