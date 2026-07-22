import type { GetScheduleData } from "@/app/actions/schedule/schedule-action";
import type { GetTipsData } from "@/app/actions/tips/tips-action";

export type MonthData = {
  rate: number;
  hours: number;
  salary: number;
  tips: number;
  total: number;
};

export type EmployeeTableRow = {
  employee: string;
  [key: string]: string | MonthData | undefined;
};

export type ChartDataItem = {
  name: string;
  salary: number;
  tips: number;
  total: number;
  hours: number;
  rate: number;
  workedMonths: number;
};

export type BarKey = keyof Omit<ChartDataItem, "name">;

export type BarItem = {
  key: BarKey;
  color: string;
  label: string;
};

export type ChartResultFilter = "employees" | "month" | "table";

export type ChartResultDataInput = {
  dataSchedules: { month: string; data: GetScheduleData[] }[] | null;
  tipsDataYear: GetTipsData[] | null;
  year: string;
  role: string;
};
