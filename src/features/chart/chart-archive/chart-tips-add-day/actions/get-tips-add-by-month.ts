"use server";

import { TIPS_ADD_ACTION_TAG } from "@/constants/action-tag";
import { TipsAddForm } from "@/features/tips-add/model/schema";
import { GetTipsAddData } from "@/features/tips-add/model/type";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache } from "next/cache";

const actionTag = TIPS_ADD_ACTION_TAG;

async function _getTipsAddByYearMonth(
  year: string,
  month: string,
): Promise<GetTipsAddData[] | null> {
  const docRef = getYearMonthDoc(actionTag, year, month);
  const daysSnap = await docRef.collection("days").get();

  if (daysSnap.empty) return null;

  const tipsAdd = daysSnap.docs.map((doc) => ({
    id: doc.id,
    currency: doc.data().currency,
    tipsAdd: doc.data().tipsAdd as TipsAddForm[],
  }));

  return tipsAdd;
}

export const getTipsAddByYearMonth = unstable_cache(
  _getTipsAddByYearMonth,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);
