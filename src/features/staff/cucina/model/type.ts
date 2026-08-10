import { ReportKitchenForm } from "./schema";

export type KitchenDataForm = {
  year: string;
  month: string;
  day: string;
  report: Omit<ReportKitchenForm, "date">;
};

export type GetKitchenData = {
  id: string;
  report: Omit<ReportKitchenForm, "date">;
};
