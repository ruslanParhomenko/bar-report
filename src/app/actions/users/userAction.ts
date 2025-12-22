"use server";

import { dbAdmin } from "@/lib/firebaseAdmin";
import { UsersSchemaTypeData } from "@/features/users/schema";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";
import { unstable_cache, updateTag } from "next/cache";

type UserData = UsersSchemaTypeData;

// create
export async function createUser(data: UserData) {
  const docRef = await dbAdmin.collection("users").add({
    mail: data.mail,
    role: data.role,
  });
  updateTag("users");
  invalidateEverywhere("users");
  return docRef.id;
}

export async function updateUser(id: string, data: Omit<UserData, "id">) {
  await dbAdmin.collection("users").doc(id).update(data);
  updateTag("users");
  invalidateEverywhere("users");
}

export async function deleteUser(id: string) {
  await dbAdmin.collection("users").doc(id).delete();
  updateTag("users");
  invalidateEverywhere("users");
}

// get

export const _getUsers = async () => {
  const snapshot = await dbAdmin.collection("users").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as UsersSchemaTypeData[];
};

export const getUsers = unstable_cache(_getUsers, ["users"], {
  revalidate: false,
  tags: ["users"],
});
