import { TTNForm } from "./schema";

export type TTNDataForm = {
  id: string;
  year: string;
  month: string;
  ttnData: TTNForm;
};

export type GetTTNData = {
  id: string;
  ttnData: TTNForm;
};
