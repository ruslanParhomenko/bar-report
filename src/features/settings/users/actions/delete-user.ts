"use server";

import { USERS_ACTION_TAG } from "@/constants/action-tag";
import { invalidateCache } from "@/lib/cache/invalidate-cache";
import { dbAdmin } from "@/lib/firebase-admin";

const TAG = USERS_ACTION_TAG;

export async function deleteUser(id: string) {
  await dbAdmin.collection(TAG).doc(id).delete();
  await invalidateCache(TAG);
}
