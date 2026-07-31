import { MONTHS } from "./get-month-days";

type MonthRange = {
  from?: number;
  to?: number;
};

export function filterByMonthRange<T extends { id: string }>(
  data: T[],
  range?: MonthRange,
): T[] {
  if (range?.from === undefined || range?.to === undefined) {
    return data;
  }

  return data.filter((item) => {
    const index = MONTHS.indexOf(item.id);

    return index >= range.from! && index <= range.to!;
  });
}
