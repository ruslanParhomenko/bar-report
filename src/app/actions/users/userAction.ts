"use server";

import { dbAdmin } from "@/lib/firebase-admin";
import { UsersSchemaTypeData } from "@/features/users/schema";
import { unstable_cache, updateTag } from "next/cache";
import { redis } from "@/lib/redis";
import { USERS_ACTION_TAG } from "@/constants/action-tag";

export type UserData = UsersSchemaTypeData;

// create
export async function createUser(data: UserData) {
  const docRef = await dbAdmin.collection(USERS_ACTION_TAG).add({
    mail: data.mail,
    role: data.role,
  });
  updateTag(USERS_ACTION_TAG);
  await redis.del(USERS_ACTION_TAG);
  return docRef.id;
}

export async function updateUser(id: string, data: Omit<UserData, "id">) {
  await dbAdmin.collection(USERS_ACTION_TAG).doc(id).update(data);
  updateTag(USERS_ACTION_TAG);
  await redis.del(USERS_ACTION_TAG);
}

export async function deleteUser(id: string) {
  await dbAdmin.collection(USERS_ACTION_TAG).doc(id).delete();
  updateTag(USERS_ACTION_TAG);
  await redis.del(USERS_ACTION_TAG);
}

// get

export const _getUsers = async () => {
  const cached = await redis.get(USERS_ACTION_TAG);
  if (cached) return cached as UsersSchemaTypeData[];
  const snapshot = await dbAdmin.collection(USERS_ACTION_TAG).get();
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  await redis.set(USERS_ACTION_TAG, users);
  return users as UsersSchemaTypeData[];
};

export const getUsers = unstable_cache(_getUsers, [USERS_ACTION_TAG], {
  revalidate: false,
  tags: [USERS_ACTION_TAG],
});

// get by id

export const _getUsersById = async (id: string) => {
  const snapshot = await dbAdmin.collection(USERS_ACTION_TAG).doc(id).get();
  if (!snapshot.exists) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as UsersSchemaTypeData;
};

export const getUsersById = unstable_cache(_getUsersById, [USERS_ACTION_TAG], {
  revalidate: false,
  tags: [USERS_ACTION_TAG],
});

// export const getUsers = async () => {
//   "use cache";

//   cacheTag("users");

//   const snapshot = await dbAdmin.collection("users").get();
//   return snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as UsersSchemaTypeData[];
// };
