"use server";

import { invalidateEverywhere } from "@/app/actions/invalidateEverywhere/invalidate-everywhere";
import { MENU_DAILY_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { updateTag } from "next/cache";
import { MenuDailyDataForm } from "../model/type";

const actionTag = MENU_DAILY_ACTION_TAG;

export async function createMenuDaily(data: MenuDailyDataForm) {
  const docRef = dbAdmin.collection(actionTag).doc("main");

  await docRef.set(data);

  updateTag(actionTag);

  invalidateEverywhere(actionTag);
}
