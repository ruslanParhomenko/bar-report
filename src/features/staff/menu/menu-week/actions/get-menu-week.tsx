"use server";

import { MENU_WEEK_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache } from "next/cache";
import { MenuWeekForm } from "../model/schema";

const actionTag = MENU_WEEK_ACTION_TAG;

export async function _getMenuWeekData(): Promise<MenuWeekForm | null> {
  const doc = await dbAdmin.collection(actionTag).doc("main").get();

  if (!doc.exists) return null;

  return doc.data() as MenuWeekForm;
}

export const getMenuWeekData = unstable_cache(_getMenuWeekData, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
