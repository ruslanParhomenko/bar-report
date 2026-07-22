import type { BarItem, ChartResultFilter, MonthData } from "./types";

export const ROLE: Record<string, string> = {
  barmen: "bar",
  waiters: "bar",
  dish: "dish",
  cucina: "cucina",
};

export const ROLE_EMPLOYEES: Record<string, string> = {
  barmen: "barmen",
  waiters: "waiters",
  dish: "dish",
  cucina: "cook",
};

export const NAV_TABS: ChartResultFilter[] = ["employees", "month", "table"];

export const SUB_HEADERS: (keyof MonthData)[] = [
  "rate",
  "hours",
  "salary",
  "tips",
  "total",
];

export const BAR_KEYS: BarItem[] = [
  { key: "salary", color: "var(--color-gn)", label: "Salary" },
  { key: "tips", color: "var(--color-rd)", label: "Tips" },
  { key: "total", color: "var(--color-bl)", label: "Total" },
  { key: "hours", color: "var(--color-primary)", label: "Hours" },
  { key: "rate", color: "var(--color-yl)", label: "Rate" },
  { key: "workedMonths", color: "var(--color-yl)", label: "Worked" },
];
