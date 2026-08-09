import { ReportBarForm } from "./schema";

export type ReportDataForm = {
  year: string;
  month: string;
  day: string;
  report: ReportBarForm;
};

export type GetReportData = {
  id: string;
  report: ReportBarForm;
};