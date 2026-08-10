import { FinForm } from "./schema";

export type FinDataForm = {
  id: string;
  year: string;
  finData: FinForm;
};

export type GetFinData = Omit<FinDataForm, "year" | "month">;
