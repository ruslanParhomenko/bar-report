"use server";
import { STOP_LIST_ACTION_TAG } from "@/constants/action-tag";
import { StopListSchemaType } from "@/features/staff/stop-list/model/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = STOP_LIST_ACTION_TAG;
export async function createStopList(data: StopListSchemaType) {
  const docRef = dbAdmin.collection(actionTag).doc(actionTag);

  await docRef.set(data);

  updateTag(actionTag);
}


