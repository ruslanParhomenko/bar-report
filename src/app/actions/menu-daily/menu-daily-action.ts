"use server";

import { MENU_DAILY_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = MENU_DAILY_ACTION_TAG;

export type MenuItem = {
  ro: string;
  en: string;
};

export type MenuDailyForm = {
  deserturi?: MenuItem[];
  "felul intii"?: MenuItem[];
  "felul principal"?: MenuItem[];
  garnituri?: MenuItem[];
  "salate si gustari"?: MenuItem[];
};

export async function createMenuDaily(data: MenuDailyForm) {
  const docRef = dbAdmin.collection(actionTag).doc("main");

  await docRef.set(data);

  updateTag(actionTag);
}

export async function _getMenuDailyData(): Promise<MenuDailyForm | null> {
  const doc = await dbAdmin.collection(actionTag).doc("main").get();

  if (!doc.exists) return null;

  return doc.data() as MenuDailyForm;
}

export const getMenuDailyData = unstable_cache(_getMenuDailyData, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
