"use server";
import { STOP_LIST_ACTION_TAG } from "@/constants/action-tag";
import { StopListSchemaType } from "@/features/staff/stop-list/model/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache} from "next/cache";

const actionTag = STOP_LIST_ACTION_TAG;

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
