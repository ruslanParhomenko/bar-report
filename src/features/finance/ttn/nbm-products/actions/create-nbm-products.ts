"use server";

import { NBM_PRODUCTS_ACTION_TAG } from "@/constants/action-tag";

import { getYearMonthDoc } from "@/lib/firebase-doc";
import { updateTag } from "next/cache";
import { NBMProductsDataForm } from "../model/type";

const actionTag = NBM_PRODUCTS_ACTION_TAG;

export async function createProductsNbm(data: Omit<NBMProductsDataForm, "id">) {
  const { year, month, dataProducts } = data;

  const docRef = getYearMonthDoc(actionTag, year, month);
  await docRef.set({ dataProducts });

  updateTag(actionTag);
  return docRef.id;
}
