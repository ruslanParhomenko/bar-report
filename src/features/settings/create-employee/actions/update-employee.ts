"use server";

import { EMPLOYEES_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { Employee } from "../model/type";



export async function updateEmployee(id: string, data: Omit<Employee, "id">) {
  await dbAdmin
    .collection(EMPLOYEES_ACTION_TAG)
    .doc(id)
    .update({
      ...data,
      employmentDate: data.employmentDate
        ? new Date(data.employmentDate)
        : null,
    });
  updateTag(EMPLOYEES_ACTION_TAG);
  await redis.del(EMPLOYEES_ACTION_TAG);
  redirect("/employees");
}


