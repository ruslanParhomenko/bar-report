"use server";

import { dbAdmin } from "@/lib/firebaseAdmin";
import { EmployeesSchemaTypeData } from "@/features/settings/employees/schema";
import { invalidateEverywhere } from "../schedule/invalidateEverywhere";

export type EmployeeData = EmployeesSchemaTypeData;

export async function createEmployee(data: EmployeeData) {
  const docRef = await dbAdmin.collection("employees").add({
    name: data.name,
    role: data.role,
    rate: data.rate,
    employmentDate: data.employmentDate,
    vacationPay: (data.vacationPay || []).map((pay) => ({
      startDate: pay.startDate,
      endDate: pay.endDate,
      countDays: pay.countDays,
    })),
  });

  invalidateEverywhere("employees");
  return docRef.id;
}

export async function updateEmployee(
  id: string,
  data: Omit<EmployeeData, "id">
) {
  await dbAdmin.collection("employees").doc(id).update(data);
  invalidateEverywhere("employees");
}

export async function deleteEmployee(id: string) {
  await dbAdmin.collection("employees").doc(id).delete();
  invalidateEverywhere("employees");
}
