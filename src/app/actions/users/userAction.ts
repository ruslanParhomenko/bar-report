"use server";

import { UsersSchemaTypeData } from "@/features/settings/users/schema";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { revalidateTag } from "next/cache";

type UserData = UsersSchemaTypeData;

export async function createUser(data: UserData) {
  const docRef = await addDoc(collection(db, "users"), {
    mail: data.mail,
    role: data.role,
  });
  revalidateTag("users");
  return docRef.id;
}

export async function updateUser(id: string, data: Omit<UserData, "id">) {
  await updateDoc(doc(db, "users", id), data);
  revalidateTag("users");
}

export async function deleteUser(id: string) {
  await deleteDoc(doc(db, "users", id));
  revalidateTag("users");
}
