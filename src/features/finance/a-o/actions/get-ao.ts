"use server";

import { AO_REPORT_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthCollection, getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache } from "next/cache";
import { GetAoData } from "../model/type";

const actionTag = AO_REPORT_ACTION_TAG;

export async function _getAOByYearAndMonth(
  year: string,
  month: string,
): Promise<GetAoData | null> {
  const docRef = getYearMonthDoc(actionTag, year, month);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return { id: snap.id, ...snap.data() } as GetAoData;
}

export const getAOByYearAndMonth = unstable_cache(
  _getAOByYearAndMonth,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);

export async function _getAOByYear(year: string): Promise<GetAoData[]> {
  const colRef = getYearMonthCollection(actionTag, year);
  const snap = await colRef.get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GetAoData[];
}

export const getAOByYear = unstable_cache(_getAOByYear, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
