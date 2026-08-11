"use server";

import { TTN_NBM_ACTION_TAG } from "@/constants/action-tag";

import { getYearMonthDoc } from "@/lib/firebase-doc";
import { updateTag } from "next/cache";
import { TTNDataForm } from "../model/type";

const actionTag = TTN_NBM_ACTION_TAG;

export async function createTtnNbm(data: Omit<TTNDataForm, "id">) {
  const { year, month, ttnData } = data;

  const docRef = getYearMonthDoc(actionTag, year, month);
  await docRef.set({ ttnData });

  updateTag(actionTag);
  return docRef.id;
}
