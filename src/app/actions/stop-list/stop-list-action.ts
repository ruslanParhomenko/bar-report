"use server";
import { STOP_LIST_ACTION_TAG } from "@/constants/action-tag";
import { StopListSchemaType } from "@/features/stop-list/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = STOP_LIST_ACTION_TAG;


// create
export async function saveStopList(data: StopListSchemaType) {
  const docRef = dbAdmin.collection(actionTag).doc(actionTag);

  await docRef.set(data);

  updateTag(actionTag);
}

// get
export async function _getStopList() {
  const docRef = dbAdmin.collection(actionTag).doc(actionTag);
  const snap = await docRef.get();

  if (!snap.exists) return null;

  const data = snap.data() as StopListSchemaType;

  return data;
}

export const getStopList = unstable_cache(_getStopList, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
