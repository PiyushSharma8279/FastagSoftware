// src/utils/index.js
export function generateCompanyId(prevCompanies = []) {
  // numeric id generator, finds max id and +1
  const ids = prevCompanies.map((c) => Number(c.id)).filter((n) => !Number.isNaN(n));
  const next = ids.length === 0 ? 1 : Math.max(...ids) + 1;
  return next;
}

export function generateItemId(prevItems = []) {
  const ids = prevItems.map((i) => Number(i.id)).filter((n) => !Number.isNaN(n));
  const next = ids.length === 0 ? 1 : Math.max(...ids) + 1;
  return next;
}

export function generateNextTagForDate(prevCompanies = []) {
  // Simple tag generator: YYYYMMDD-XXX based on today + counter
  const base = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  // count items with today's prefix
  let count = 0;
  prevCompanies.forEach((c) => {
    (c.items || []).forEach((it) => {
      if (String(it.tag || "").startsWith(base)) count++;
    });
  });
  return `${base}-${(count + 1).toString().padStart(3, "0")}`;
}
