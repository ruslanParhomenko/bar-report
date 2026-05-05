"use server";

import { TipsForm } from "@/features/tips/schema";

import { TIPS_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthCollection, getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = TIPS_ACTION_TAG;

// type
export type TipsDataForm = {
  id: string;
  year: string;
  month: string;
  tipsData: TipsForm;
};

export type GetTipsData = Omit<TipsDataForm, "year" | "month">;

// create
export async function createTips(data: Omit<TipsDataForm, "id">) {
  const { year, month, tipsData } = data;

  const docRef = getYearMonthDoc(actionTag, year, month);

  await docRef.set({ tipsData });

  updateTag(actionTag);

  return docRef.id;
}

// get by month year
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

// get by year

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
