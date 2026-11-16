import { MONTHS } from "@/utils/get-month-days";

export function canViewSchedule(
  year: string,
  month: string,
  prevMonths: number = 0,
  nextMonths: number = 1,
): boolean {
  const now = new Date();

  const currentIndex = now.getFullYear() * 12 + now.getMonth();
  const requestedIndex = Number(year) * 12 + MONTHS.indexOf(month);

  return (
    requestedIndex >= currentIndex - prevMonths &&
    requestedIndex <= currentIndex + nextMonths
  );
}
