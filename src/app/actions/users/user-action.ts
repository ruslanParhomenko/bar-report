"use server";

import { USERS_ACTION_TAG } from "@/constants/action-tag";
import { UserForm } from "@/features/employees/users/create/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";
import { unstable_cache, updateTag } from "next/cache";

type UserDataForm = UserForm;

export type GetUserData = UserDataForm & {
  id: string;
};

const actionTag = USERS_ACTION_TAG;
async function invalidateCache() {
  updateTag(actionTag);
  await redis.del(actionTag);

  await redis.publish("cache:invalidate", actionTag);
}

// create
export async function createUser(data: UserDataForm) {
  const docRef = await dbAdmin.collection(USERS_ACTION_TAG).add(data);
  await invalidateCache();
  return docRef.id;
}

// update
export async function updateUser(id: string, data: UserDataForm) {
  await dbAdmin.collection(USERS_ACTION_TAG).doc(id).update(data);
  await invalidateCache();
  return id;
}

// delete
export async function deleteUser(id: string) {
  await dbAdmin.collection(USERS_ACTION_TAG).doc(id).delete();
  await invalidateCache();
}

// get

export async function _getUsers(): Promise<GetUserData[]> {
  const cached = await redis.get<GetUserData[]>(USERS_ACTION_TAG);
  if (cached) return cached;

  const snapshot = await dbAdmin.collection(USERS_ACTION_TAG).get();
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GetUserData[];

  await redis.set(USERS_ACTION_TAG, users);
  return users;
}

export const getUsers = unstable_cache(_getUsers, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
