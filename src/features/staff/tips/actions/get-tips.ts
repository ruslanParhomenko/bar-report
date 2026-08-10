"use server";

import { TIPS_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthCollection, getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache } from "next/cache";
import { GetTipsData } from "../model/type";

const actionTag = TIPS_ACTION_TAG;

export async function _getTipsByYearAndMonth(
  year: string,
  month: string,
): Promise<GetTipsData | null> {
  const docRef = getYearMonthDoc(actionTag, year, month);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return { id: snap.id, ...snap.data() } as GetTipsData;
}
export const getTipsByYearAndMonth = unstable_cache(
  _getTipsByYearAndMonth,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);

export async function _getTipsByYear(
  year: string,
): Promise<GetTipsData[] | null> {
  const colRef = getYearMonthCollection(actionTag, year);

  const snap = await colRef.get();

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GetTipsData[];
}

export const getTipsByYear = unstable_cache(_getTipsByYear, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
