import { CashForm } from "./schema";

export type CashDataForm = {
  id: string;
  year: string;
  month: string;
  cashData: CashForm;
};

export type GetCashData = {
  id: string;
  cashData: CashForm;
};
