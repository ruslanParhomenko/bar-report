import { TTNFormNBM } from "./schema";

export type TTNDataForm = {
  id: string;
  year: string;
  month: string;
  ttnData: TTNFormNBM;
};

export type GetTtnNbmData = {
  id: string;
  ttnData: TTNFormNBM;
};
