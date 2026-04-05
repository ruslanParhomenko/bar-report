"use server";

import { dbAdmin } from "@/lib/firebase-admin";
import { TIPS_ADD_ACTION_TAG } from "@/constants/action-tag";
import { TipsAddFormValues } from "@/features/bar/tips-add/schema";
import { unstable_cache, updateTag } from "next/cache";
type TipsAddCreateType = {
  tipsAdd: TipsAddFormValues[];
  day: string;
  uniqueKey: string;
  currency: string;
};

export type TipsAddData = {
  day: string;
  tipsAdd: TipsAddFormValues[];
  currency: string;
};

export async function createTipsAdd(data: TipsAddCreateType) {
  const docRef = dbAdmin.collection(TIPS_ADD_ACTION_TAG).doc(data.uniqueKey);
  const snap = await docRef.get();

  if (!snap.exists) {
    const doc = {
      day: data.day,
      tipsAdd: data.tipsAdd,
      currency: data.currency,
    };

    await docRef.set(doc);
    updateTag(TIPS_ADD_ACTION_TAG);
    return;
  }

  const raw = snap.data() as any;

  const isDayExists = raw.data.some((d: any) => d.day === data.day);
  if (isDayExists) return;

  const updatedData = raw.data.map((d: any) => (d.day === data.day ? data : d));

  await docRef.update({ data: updatedData });

  updateTag(TIPS_ADD_ACTION_TAG);
}

// get by unique key
export async function _getTipsAddByUniqueKey(uniqueKey: string) {
  const docRef = dbAdmin.collection(TIPS_ADD_ACTION_TAG).doc(uniqueKey);
  const snap = await docRef.get();

  if (!snap.exists) return null;

  const data = snap.data() as any;

  return data as TipsAddData[];
}

export const getTipsAddByUniqueKey = unstable_cache(
  _getTipsAddByUniqueKey,
  [TIPS_ADD_ACTION_TAG],
  { revalidate: false, tags: [TIPS_ADD_ACTION_TAG] },
);
