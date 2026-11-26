"use server";

import { TIPS_ACTION_TAG } from "@/constants/action-tag";
import { GetTipsData } from "@/features/tips-month/model/type";
import { getYearMonthCollection } from "@/lib/firebase-doc";
import { unstable_cache } from "next/cache";

const actionTag = TIPS_ACTION_TAG;

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
