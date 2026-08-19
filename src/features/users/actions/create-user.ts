"use server";

import { USERS_ACTION_TAG } from "@/constants/action-tag";
import { UserForm } from "@/features/users/model/schema";
import { invalidateCache } from "@/lib/cache/invalidate-cache";
import { dbAdmin } from "@/lib/firebase-admin";

const TAG = USERS_ACTION_TAG;

export async function createUser(data: UserForm) {
  const docRef = await dbAdmin.collection(TAG).add(data);
  await invalidateCache(TAG);
  return docRef.id;
}
