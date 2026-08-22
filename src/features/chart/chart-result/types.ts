import { GetScheduleData } from "@/features/schedule/schedule-edit/model/type";
import { Employee } from "@/features/settings/create-employee/model/type";
import { GetTipsData } from "@/features/staff/tips/model/type";

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

export type ChartResultFilter = "employees" | "month" | "table";

export type ChartResultDataInput = {
  dataSchedules: { month: string; data: GetScheduleData[] }[] | null;
  tipsDataYear: GetTipsData[] | null;
  employees: Employee[];
  year: string;
  role: string;
};
