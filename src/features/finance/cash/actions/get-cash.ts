"use server";

import { CASH_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthCollection, getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache } from "next/cache";
import { GetCashData } from "../model/type";

const actionTag = CASH_ACTION_TAG;

export async function _getCashByYearAndMonth(
  year: string,
  month: string,
): Promise<GetCashData | null> {
  const docRef = getYearMonthDoc(actionTag, year, month);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return { id: snap.id, ...snap.data() } as GetCashData;
}

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
