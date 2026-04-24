"use server";

import { TipsForm } from "@/features/tips/schema";

import { TIPS_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

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

  const docRef = dbAdmin
    .collection(TIPS_ACTION_TAG)
    .doc(year)
    .collection("months")
    .doc(month);

  await docRef.set({ tipsData });

  updateTag(TIPS_ACTION_TAG);

  return docRef.id;
}

// get by month year
export async function _getTipsByYearAndMonth(
  year: string,
  month: string,
): Promise<GetTipsData | null> {
  const docRef = dbAdmin
    .collection(TIPS_ACTION_TAG)
    .doc(year)
    .collection("months")
    .doc(month);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return { id: snap.id, ...snap.data() } as GetTipsData;
}

// get by year

export async function getTipsByYear(year: string) {
  const colRef = dbAdmin
    .collection(TIPS_ACTION_TAG)
    .doc(year)
    .collection("months");

  const snap = await colRef.get();

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export const getTipsByYearAndMonth = unstable_cache(
  _getTipsByYearAndMonth,
  [TIPS_ACTION_TAG],
  {
    revalidate: false,
    tags: [TIPS_ACTION_TAG],
  },
);
