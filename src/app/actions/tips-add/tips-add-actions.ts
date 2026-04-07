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

  // 🟢 если документа нет — сразу новая структура
  if (!snap.exists) {
    await docRef.set({
      data: [data],
    });

    updateTag(TIPS_ADD_ACTION_TAG);
    return;
  }

  const raw = snap.data() as any;

  // 🔥 МИГРАЦИЯ (можно удалить позже)
  let currentData: TipsAddData[] = raw.data;

  if (!currentData) {
    if (raw.day) {
      currentData = [
        {
          day: raw.day,
          tipsAdd: raw.tipsAdd,
          currency: raw.currency,
        },
      ];
    } else {
      currentData = [];
    }
  }
  // 🔥 конец миграции

  const isDayExists = currentData.some((d) => d.day === data.day);
  if (isDayExists) return;

  await docRef.update({
    data: [...currentData, data],
  });

  updateTag(TIPS_ADD_ACTION_TAG);
}

// get by unique key
export async function _getTipsAddByUniqueKey(uniqueKey: string) {
  const docRef = dbAdmin.collection(TIPS_ADD_ACTION_TAG).doc(uniqueKey);
  const snap = await docRef.get();

  if (!snap.exists) return null;

  const raw = snap.data() as any;

  // 🔥 МИГРАЦИЯ (та же логика)
  if (!raw.data) {
    if (raw.day) {
      return [
        {
          day: raw.day,
          tipsAdd: raw.tipsAdd,
          currency: raw.currency,
        },
      ];
    }
    return [];
  }

  return raw.data as TipsAddData[];
}

export const getTipsAddByUniqueKey = unstable_cache(
  _getTipsAddByUniqueKey,
  [TIPS_ADD_ACTION_TAG],
  { revalidate: false, tags: [TIPS_ADD_ACTION_TAG] },
);
