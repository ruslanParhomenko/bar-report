"use server";

import { TIPS_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthDoc } from "@/lib/firebase-doc";
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
