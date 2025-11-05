"use server";

import { UsersSchemaTypeData } from "@/features/settings/users/schema";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { revalidateTag, unstable_cache } from "next/cache";

async function fetchUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as UsersSchemaTypeData[];
}

export const getUsers = unstable_cache(fetchUsers, ["users"], {
  tags: ["users"],
});

export async function invalidateUsers() {
  revalidateTag("users");
}
