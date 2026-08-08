type RowAOData = Record<string, (string | undefined)[] | undefined> | undefined;

export function calculateRowAOTotals(
  rowAOData?: RowAOData,
): Record<string, number> {
  if (!rowAOData) return {};

  return Object.entries(rowAOData).reduce<Record<string, number>>(
    (acc, [key, value]) => {
      if (!Array.isArray(value)) {
        acc[key] = 0;
        return acc;
      }

      const total = value.reduce((sum, item) => {
        const num = Number(item);
        return Number.isFinite(num) ? sum + num : sum;
      }, 0);

      acc[key] = total;
      return acc;
    },
    {},
  );
}
