"use server";

import { EMPLOYEES_ACTION_TAG } from "@/constants/action-tag";
import { EmployeeForm } from "@/features/employees/employee/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";
import { unstable_cache, updateTag } from "next/cache";
import { redirect } from "next/navigation";

export type Employee = EmployeeForm & { id: string };

// create
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
  return docRef.id;
}

// update
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

// delete
export async function deleteEmployee(id: string) {
  await dbAdmin.collection(EMPLOYEES_ACTION_TAG).doc(id).delete();
  updateTag(EMPLOYEES_ACTION_TAG);
  await redis.del(EMPLOYEES_ACTION_TAG);
}

// get

const _getEmployees = async (): Promise<Employee[]> => {
  const snapshot = await dbAdmin.collection(EMPLOYEES_ACTION_TAG).get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    let employmentDate: string | null = null;

    if (data.employmentDate) {
      if (typeof data.employmentDate === "string") {
        employmentDate = data.employmentDate;
      } else if (data.employmentDate instanceof Date) {
        employmentDate = data.employmentDate.toISOString();
      } else if ("toDate" in data.employmentDate) {
        employmentDate = data.employmentDate.toDate().toISOString();
      }
    }

    return {
      id: doc.id,
      ...data,
      employmentDate,
    } as Employee;
  });
};

export const getEmployees = unstable_cache(
  _getEmployees,
  [EMPLOYEES_ACTION_TAG],
  {
    revalidate: false,
    tags: [EMPLOYEES_ACTION_TAG],
  },
);
