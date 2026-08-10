import { AoForm } from "./schema";

export type AoDataForm = {
  id: string;
  year: string;
  month: string;
  aoData: AoForm;
};
export type GetAoData = {
  id: string;
  aoData: AoForm;
};
