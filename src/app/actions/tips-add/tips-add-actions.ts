"use server";

import { TIPS_ADD_ACTION_TAG } from "@/constants/action-tag";
import { TipsAddForm } from "@/features/bar/tips-add/schema";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = TIPS_ADD_ACTION_TAG;

type TipsAddDataForm = {
  day: string;
  month: string;
  year: string;
  currency: string;
  tipsAdd: TipsAddForm[];
};

export type GetTipsAddData = {
  id: string;
  currency: string;
  tipsAdd: TipsAddForm[];
};

export async function createTipsAdd(data: TipsAddDataForm) {
  const { year, month, day, tipsAdd, currency } = data;
  const docRef = getYearMonthDoc(actionTag, year, month);
  const docRefByDay = docRef.collection("days").doc(day);

  await docRefByDay.set({
    currency,
    tipsAdd,
  });

  updateTag(actionTag);
  return docRefByDay.id;
}

// get by month year
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
