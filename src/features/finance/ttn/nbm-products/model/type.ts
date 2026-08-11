import { ProductsFormNBM } from "./schema";

export type NBMProductsDataForm = {
  id: string;
  year: string;
  month: string;
  dataProducts: ProductsFormNBM;
};

export type GetNbmProductsData = {
  id: string;
  dataProducts: ProductsFormNBM;
};
