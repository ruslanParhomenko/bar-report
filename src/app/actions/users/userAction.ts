"use server";

import { dbAdmin } from "@/lib/firebaseAdmin";
import { UsersSchemaTypeData } from "@/features/users/schema";
import { unstable_cache } from "next/cache";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";

type UserData = UsersSchemaTypeData;

// create
export async function createUser(data: UserData) {
  const docRef = await dbAdmin.collection("users").add({
    mail: data.mail,
    role: data.role,
  });
  invalidateEverywhere("users");
  return docRef.id;
}

export async function updateUser(id: string, data: Omit<UserData, "id">) {
  await dbAdmin.collection("users").doc(id).update(data);
  invalidateEverywhere("users");
}

export async function deleteUser(id: string) {
  await dbAdmin.collection("users").doc(id).delete();
  invalidateEverywhere("users");
}

// get

const fetchUsersAdmin = async () => {
  const snapshot = await dbAdmin.collection("users").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as UsersSchemaTypeData[];
};

export const getUsers = unstable_cache(fetchUsersAdmin, ["users"], {
  revalidate: false,
  tags: ["users"],
});
