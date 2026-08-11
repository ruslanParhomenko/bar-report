"use server";

import { USERS_ACTION_TAG } from "@/constants/action-tag";
import { invalidateCache } from "@/lib/cache/invalidate-cache";
import { dbAdmin } from "@/lib/firebase-admin";
import { UserForm } from "../model/schema";

const TAG = USERS_ACTION_TAG;

export async function updateUser(id: string, data: UserForm) {
  await dbAdmin.collection(TAG).doc(id).update(data);
  await invalidateCache(TAG);
  return id;
}
