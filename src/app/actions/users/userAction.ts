"use server";

import { dbAdmin } from "@/lib/firebaseAdmin";
import { UsersSchemaTypeData } from "@/features/settings/users/schema";
import { revalidateTag } from "next/cache";

type UserData = UsersSchemaTypeData;

export async function createUser(data: UserData) {
  const docRef = await dbAdmin.collection("users").add({
    mail: data.mail,
    role: data.role,
  });
  revalidateTag("users");
  return docRef.id;
}

export async function updateUser(id: string, data: Omit<UserData, "id">) {
  await dbAdmin.collection("users").doc(id).update(data);
  revalidateTag("users");
}

export async function deleteUser(id: string) {
  await dbAdmin.collection("users").doc(id).delete();
  revalidateTag("users");
}
