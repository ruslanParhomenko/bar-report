export const formatNumber = (value: number | string | null | undefined) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "";
  const rounded = Math.round(num * 100) / 100;
  if (rounded === 0) return "";
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
};
