"use server";

import { NBM_PRODUCTS_ACTION_TAG } from "@/constants/action-tag";

import { getYearMonthCollection } from "@/lib/firebase-doc";
import { unstable_cache } from "next/cache";
import { GetNbmProductsData } from "../model/type";

const actionTag = NBM_PRODUCTS_ACTION_TAG;

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
