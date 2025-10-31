// src/utils/groupRowsByRole.ts
export function groupRowsByRole<T extends { role: string }>(fields: T[]) {
  const groups: Record<string, T[]> = {
    waiters: [],
    barmen: [],
    dish: [],
  };

  fields.forEach((row) => {
    if (row.role === "waiters") groups.waiters.push(row);
    else if (row.role === "barmen") groups.barmen.push(row);
    else if (row.role === "dish") groups.dish.push(row);
  });

  return groups;
}
