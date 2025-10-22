"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { revalidateTag, unstable_cache } from "next/cache";

async function fetchUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export const getUsers = unstable_cache(fetchUsers, ["users"], {
  tags: ["users"],
});

export const invalidateUsers = () => {
  revalidateTag("users");
};
