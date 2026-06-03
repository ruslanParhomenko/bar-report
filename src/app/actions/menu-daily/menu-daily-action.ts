"use server";

import { MENU_DAILY_ACTION_TAG } from "@/constants/action-tag";
import { MenuDailyForm } from "@/features/menu/menu-daily/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = MENU_DAILY_ACTION_TAG;

type MenuDailyDataForm = MenuDailyForm;

export async function createMenuDaily(data: MenuDailyDataForm) {
  const docRef = dbAdmin.collection(actionTag).doc("main");

  await docRef.set(data);

  updateTag(actionTag);
}

export async function _getMenuDailyData(): Promise<MenuDailyDataForm | null> {
  const doc = await dbAdmin.collection(actionTag).doc("main").get();

  if (!doc.exists) return null;

  return doc.data() as MenuDailyDataForm;
}

export const getMenuDailyData = unstable_cache(_getMenuDailyData, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
