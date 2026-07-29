"use server";

import { NBM_PRODUCTS_ACTION_TAG } from "@/constants/action-tag";

import { ProductsFormNBM } from "@/features/ttn/nbm-products/schema";
import { getYearMonthCollection, getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";

// type
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

const actionTag = NBM_PRODUCTS_ACTION_TAG;

// create
export async function createProductsNbm(data: Omit<NBMProductsDataForm, "id">) {
  const { year, month, dataProducts } = data;

  const docRef = getYearMonthDoc(actionTag, year, month);
  await docRef.set({ dataProducts });

  updateTag(actionTag);
  return docRef.id;
}

// get by year

export async function _getProductsNbmByYear(
  year: string,
): Promise<GetNbmProductsData[]> {
  const colRef = getYearMonthCollection(actionTag, year);
  const snap = await colRef.get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GetNbmProductsData[];
}

export const getProductsNbmByYear = unstable_cache(
  _getProductsNbmByYear,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);
