"use server";

import { TTN_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { updateTag } from "next/cache";
import { TTNDataForm } from "../model/type";

const actionTag = TTN_ACTION_TAG;

export async function createTTN(data: Omit<TTNDataForm, "id">) {
  const { year, month, ttnData } = data;

  const docRef = getYearMonthDoc(actionTag, year, month);
  await docRef.set({ ttnData });

  updateTag(actionTag);
  return docRef.id;
}
