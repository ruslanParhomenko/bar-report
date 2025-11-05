"use server";

import { dbAdmin } from "@/lib/firebaseAdmin";
import { unstable_cache, revalidateTag } from "next/cache";

const _getEmployees = async () => {
  const snapshot = await dbAdmin.collection("employees").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getEmployees = unstable_cache(_getEmployees, ["employees"], {
  revalidate: false,
  tags: ["employees"],
});

export async function invalidateEmployees() {
  revalidateTag("employees");
}
