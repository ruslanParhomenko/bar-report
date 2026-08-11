"use server";

import { EMPLOYEES_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";
import { updateTag } from "next/cache";
import { Employee } from "../model/type";

export async function createEmployee(data: Omit<Employee, "id">) {
  const docRef = await dbAdmin.collection(EMPLOYEES_ACTION_TAG).add({
    ...data,
    employmentDate: data.employmentDate ? new Date(data.employmentDate) : null,
  });

  updateTag(EMPLOYEES_ACTION_TAG);
  await redis.del(EMPLOYEES_ACTION_TAG);

  return { success: true, id: docRef.id };
}
