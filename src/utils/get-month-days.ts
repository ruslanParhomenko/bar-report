export const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export const YEAR = ["2025", "2026", "2027", "2028", "2029", "2030"];

export type MonthDayType = {
  day: number;
  weekday: string;
};

export const getMonthDays = ({
  month,
  year,
}: {
  month: string;
  year: string;
}) => {
  if (!month) return [];

  const monthIndex = MONTHS.findIndex(
    (m) => m.toLowerCase() === month.toLowerCase(),
  );
  if (monthIndex < 0) return [];

  const daysInMonth = new Date(Number(year), monthIndex + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(Number(year), monthIndex, i + 1);
    return {
      day: i + 1,
      weekday: date
        .toLocaleDateString("ru-RU", { weekday: "short" })
        .replace(".", ""),
    };
  });
};

// get prev month

export type Month = (typeof MONTHS)[number];
export function getPrevUniqueKey(year: string, month: Month) {
  const yearNum = Number(year);
  const monthIndex = MONTHS.indexOf(month);

  if (monthIndex === -1) {
    throw new Error(`Invalid month: ${month}`);
  }

  const isJanuary = monthIndex === 0;

  const prevMonth = isJanuary ? MONTHS[11] : MONTHS[monthIndex - 1];

  const prevYear = isJanuary ? yearNum - 1 : yearNum;

  return `${prevYear}-${prevMonth}`;
}
