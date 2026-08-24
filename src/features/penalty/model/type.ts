import { RemarksForm } from "./schema";

export type RemarksDataForm = {
  day: string;
  month: string;
  year: string;
  remarks: RemarksForm;
};

export type GetRemarksData = {
  id: string;
  remarks: RemarksForm["remarks"];
};

export type GetRemarksYearData = {
  id: string;
  remarks: GetRemarksData[];
};
