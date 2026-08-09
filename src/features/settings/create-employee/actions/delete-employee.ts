"use server";

import { EMPLOYEES_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";
import { updateTag } from "next/cache";




export async function deleteEmployee(id: string) {
  await dbAdmin.collection(EMPLOYEES_ACTION_TAG).doc(id).delete();
  updateTag(EMPLOYEES_ACTION_TAG);
  await redis.del(EMPLOYEES_ACTION_TAG);
}


