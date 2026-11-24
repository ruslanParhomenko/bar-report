"use server";

import { CASH_ACTION_TAG } from "@/constants/action-tag";
import type { CashDataForm } from "@/features/cash-month/model/type";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { updateTag } from "next/cache";

const actionTag = CASH_ACTION_TAG;

export async function createCash(data: Omit<CashDataForm, "id">) {
  const { year, month, cashData } = data;

  const docRef = getYearMonthDoc(actionTag, year, month);
  await docRef.set({ cashData });

  updateTag(actionTag);
  return docRef.id;
}
