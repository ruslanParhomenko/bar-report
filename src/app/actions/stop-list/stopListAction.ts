"use server";
import { unstable_cache, updateTag } from "next/cache";
import { StopListSchemaType } from "@/features/info/stop-list/schema";
import { dbAdmin } from "@/lib/firebase-admin";

const REALTIME_DOC = "stop-list-bar-realtime";

export type StopListType = {
  id: string;
  user_email: string;
  form_data: StopListSchemaType;
};

// create
export async function saveStopList(data: StopListSchemaType) {
  const docRef = dbAdmin.collection(REALTIME_DOC).doc(REALTIME_DOC);

  await docRef.set(data);

  updateTag(REALTIME_DOC);
}

// get
export async function _getStopList() {
  const docRef = dbAdmin.collection(REALTIME_DOC).doc(REALTIME_DOC);
  const snap = await docRef.get();

  if (!snap.exists) return null;

  const data = snap.data() as StopListSchemaType;

  return data;
}

export const getStopList = unstable_cache(_getStopList, [REALTIME_DOC], {
  revalidate: false,
  tags: [REALTIME_DOC],
});
