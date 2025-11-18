// src/utils/index.js
export function generateCompanyId(prevCompanies = []) {
  const ids = prevCompanies.map((c) => Number(c.id)).filter((n) => !Number.isNaN(n));
  const next = ids.length === 0 ? 1 : Math.max(...ids) + 1;
  return next;
}

export function generateItemId(prevItems = []) {
  const ids = prevItems.map((i) => Number(i.id)).filter((n) => !Number.isNaN(n));
  const next = ids.length === 0 ? 1 : Math.max(...ids) + 1;
  return next;
}

/**
 * generateNextTagForDate(prevCompanies)
 * - prevCompanies: array of companies (each with .items)
 * - Returns YYYYMMDD-XXX where XXX is count+1 for today's items across companies
 */
export function generateNextTagForDate(prevCompanies = []) {
  const base = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  let count = 0;
  prevCompanies.forEach((c) => {
    (c.items || []).forEach((it) => {
      if (String(it.tag || "").startsWith(base)) count++;
    });
  });
  return `${base}-${(count + 1).toString().padStart(3, "0")}`;
}
