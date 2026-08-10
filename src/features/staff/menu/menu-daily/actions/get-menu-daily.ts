"use server";

import { MENU_DAILY_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache } from "next/cache";
import { MenuDailyDataForm } from "../model/type";

const actionTag = MENU_DAILY_ACTION_TAG;

export async function _getMenuDailyData(): Promise<MenuDailyDataForm | null> {
  const doc = await dbAdmin.collection(actionTag).doc("main").get();

  if (!doc.exists) return null;

  return doc.data() as MenuDailyDataForm;
}

export const getMenuDailyData = unstable_cache(_getMenuDailyData, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
