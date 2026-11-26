"use server";

import { TIPS_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { updateTag } from "next/cache";
import { TipsDataForm } from "../model/type";

const actionTag = TIPS_ACTION_TAG;

export async function createTips(data: Omit<TipsDataForm, "id">) {
  const { year, month, tipsData } = data;

  const docRef = getYearMonthDoc(actionTag, year, month);

  await docRef.set({ tipsData });

  updateTag(actionTag);

  return docRef.id;
}
