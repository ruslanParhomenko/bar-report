import type { ChartResultFilter, MonthData } from "./types";

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
