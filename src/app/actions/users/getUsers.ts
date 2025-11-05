"use server";

import { dbAdmin } from "@/lib/firebaseAdmin";
import { UsersSchemaTypeData } from "@/features/settings/users/schema";
import { revalidateTag, unstable_cache } from "next/cache";

const fetchUsersAdmin = async () => {
  const snapshot = await dbAdmin.collection("users").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as UsersSchemaTypeData[];
};

export const getUsers = unstable_cache(fetchUsersAdmin, ["users"], {
  tags: ["users"],
});

export async function invalidateUsers() {
  revalidateTag("users");
}
