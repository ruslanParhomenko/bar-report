import { TipsAddForm } from "./schema";

export type TipsAddDataForm = {
  day: string;
  month: string;
  year: string;
  currency: string;
  tipsAdd: TipsAddForm[];
};

export type GetTipsAddData = {
  id: string;
  currency: string;
  tipsAdd: TipsAddForm[];
};

export type GetTipsAddByYear = {
  id: string;
  tipsAdd: GetTipsAddData[];
};