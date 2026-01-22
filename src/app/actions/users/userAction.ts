"use server";

import { dbAdmin } from "@/lib/firebase-admin";
import { UsersSchemaTypeData } from "@/features/users/schema";
import { unstable_cache, updateTag } from "next/cache";
import { redis } from "@/lib/redis";

export type UserData = UsersSchemaTypeData;
const USERS_KEY = "users";

// create
export async function createUser(data: UserData) {
  const docRef = await dbAdmin.collection(USERS_KEY).add({
    mail: data.mail,
    role: data.role,
  });
  updateTag(USERS_KEY);
  await redis.del(USERS_KEY);
  return docRef.id;
}

export async function updateUser(id: string, data: Omit<UserData, "id">) {
  await dbAdmin.collection(USERS_KEY).doc(id).update(data);
  updateTag(USERS_KEY);
  await redis.del(USERS_KEY);
}

export async function deleteUser(id: string) {
  await dbAdmin.collection(USERS_KEY).doc(id).delete();
  updateTag(USERS_KEY);
  await redis.del(USERS_KEY);
}

// get

export const _getUsers = async () => {
  const snapshot = await dbAdmin.collection(USERS_KEY).get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as UsersSchemaTypeData[];
};

export const getUsers = unstable_cache(_getUsers, [USERS_KEY], {
  revalidate: false,
  tags: [USERS_KEY],
});

// get by id

export const _getUsersById = async (id: string) => {
  const snapshot = await dbAdmin.collection(USERS_KEY).doc(id).get();
  if (!snapshot.exists) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as UsersSchemaTypeData;
};

export const getUsersById = unstable_cache(_getUsersById, [USERS_KEY], {
  revalidate: false,
  tags: [USERS_KEY],
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
