"use server";

import { dbAdmin } from "@/lib/firebaseAdmin";
import { EmployeesSchemaTypeData } from "@/features/settings/employees/schema";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";
import { unstable_cache } from "next/cache";

export type EmployeeData = EmployeesSchemaTypeData;

// create
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

// update
export async function updateEmployee(
  id: string,
  data: Omit<EmployeeData, "id">
) {
  await dbAdmin.collection("employees").doc(id).update(data);
  invalidateEverywhere("employees");
}

// delete
export async function deleteEmployee(id: string) {
  await dbAdmin.collection("employees").doc(id).delete();
  invalidateEverywhere("employees");
}

// get

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
