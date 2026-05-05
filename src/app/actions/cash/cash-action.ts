"use server";

import { CASH_ACTION_TAG } from "@/constants/action-tag";
import { CashForm } from "@/features/cash/schema";
import { getYearMonthCollection, getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";

// type
export type CashDataForm = {
  id: string;
  year: string;
  month: string;
  cashData: CashForm;
};

export type GetCashData = {
  id: string;
  cashData: CashForm;
};

const actionTag = CASH_ACTION_TAG;

// create
export async function createCash(data: Omit<CashDataForm, "id">) {
  const { year, month, cashData } = data;

  const docRef = getYearMonthDoc(actionTag, year, month);
  await docRef.set({ cashData });

  updateTag(actionTag);
  return docRef.id;
}

// get by month year
export async function _getCashByYearAndMonth(
  year: string,
  month: string,
): Promise<GetCashData | null> {
  const docRef = getYearMonthDoc(actionTag, year, month);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return { id: snap.id, ...snap.data() } as GetCashData;
}

// get by year

export async function _getCashByYear(year: string): Promise<GetCashData[]> {
  const colRef = getYearMonthCollection(actionTag, year);
  const snap = await colRef.get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GetCashData[];
}

export const getCashByYearAndMonth = unstable_cache(
  _getCashByYearAndMonth,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);

export const getCashByYear = unstable_cache(_getCashByYear, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
