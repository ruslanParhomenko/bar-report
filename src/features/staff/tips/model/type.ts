import { TipsForm } from "./schema";

export type TipsDataForm = {
  id: string;
  year: string;
  month: string;
  tipsData: TipsForm;
};

export type GetTipsData = Omit<TipsDataForm, "year" | "month">;
