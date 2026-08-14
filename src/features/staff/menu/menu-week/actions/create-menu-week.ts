"use server";

import { invalidateEverywhere } from "@/app/actions/invalidateEverywhere/invalidate-everywhere";
import { MENU_WEEK_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { updateTag } from "next/cache";
import { MenuWeekForm } from "../model/schema";

const actionTag = MENU_WEEK_ACTION_TAG;

export async function createMenuWeek(data: MenuWeekForm) {
  const docRef = dbAdmin.collection(actionTag).doc("main");

  await docRef.set(data);

  updateTag(actionTag);

  invalidateEverywhere(actionTag);
}
