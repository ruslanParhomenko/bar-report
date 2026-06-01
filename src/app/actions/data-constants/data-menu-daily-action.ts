import { DATA_MENU_DAILY_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = DATA_MENU_DAILY_ACTION_TAG;

// TYPES

export type MenuDailyItem = {
  ro: string;
  en: string;
};

export type MenuDailyDictionary = {
  "felul principal": MenuDailyItem[];
  garnituri: MenuDailyItem[];
  "felul intii": MenuDailyItem[];
  "salate si gustari": MenuDailyItem[];
  deserturi: MenuDailyItem[];
};

// CREATE

export async function createDataMenuDaily(data: MenuDailyDictionary) {
  const docRef = dbAdmin.collection(actionTag).doc(actionTag);

  await docRef.set(data);

  updateTag(actionTag);
}

// GET

export async function _getDataMenuDaily() {
  const docRef = dbAdmin.collection(actionTag).doc(actionTag);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return snap.data() as MenuDailyDictionary;
}

export const getDataMenuDaily = unstable_cache(_getDataMenuDaily, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
