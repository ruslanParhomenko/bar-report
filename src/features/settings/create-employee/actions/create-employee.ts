"use server";

import { EMPLOYEES_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";
import {  updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { Employee } from "../model/type";


export async function createEmployee(data: Omit<Employee, "id">) {
  const docRef = await dbAdmin.collection(EMPLOYEES_ACTION_TAG).add({
    name: data.name,
    role: data.role,
    rate: data.rate,
    mail: data.mail,
    tel: data.tel,
    status: data.status,
    employmentDate: data.employmentDate ? new Date(data.employmentDate) : null,
    vacationPay: (data.vacationPay || []).map((pay) => ({
      startDate: pay.startDate,
      endDate: pay.endDate,
      countDays: pay.countDays,
    })),
  });
  updateTag(EMPLOYEES_ACTION_TAG);
  await redis.del(EMPLOYEES_ACTION_TAG);
  redirect("/employees");
}





