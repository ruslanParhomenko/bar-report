"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { unstable_cache, revalidateTag } from "next/cache";

const _getSchedule = async () => {
  const snapshot = await getDocs(collection(db, "schedule"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getSchedule = unstable_cache(_getSchedule, ["schedule"], {
  revalidate: false,
  tags: ["schedule"],
});

export async function invalidateEmployees() {
  revalidateTag("schedule");
}
