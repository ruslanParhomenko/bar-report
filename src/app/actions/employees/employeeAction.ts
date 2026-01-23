"use server";

import { dbAdmin } from "@/lib/firebase-admin";
import { EmployeesSchemaTypeData } from "@/features/employees/schema";
import { unstable_cache, updateTag } from "next/cache";
import { redis } from "@/lib/redis";
import { EMPLOYEES_ACTION_TAG } from "@/constants/action-tag";

export type EmployeeData = EmployeesSchemaTypeData;

// create
export async function createEmployee(data: EmployeeData) {
  const docRef = await dbAdmin.collection(EMPLOYEES_ACTION_TAG).add({
    name: data.name,
    role: data.role,
    rate: data.rate,
    mail: data.mail,
    tel: data.tel,
    status: data.status,
    employmentDate: data.employmentDate,
    vacationPay: (data.vacationPay || []).map((pay) => ({
      startDate: pay.startDate,
      endDate: pay.endDate,
      countDays: pay.countDays,
    })),
  });
  updateTag(EMPLOYEES_ACTION_TAG);
  await redis.del(EMPLOYEES_ACTION_TAG);
  return docRef.id;
}

// update
export async function updateEmployee(
  id: string,
  data: Omit<EmployeeData, "id">,
) {
  await dbAdmin.collection(EMPLOYEES_ACTION_TAG).doc(id).update(data);
  updateTag(EMPLOYEES_ACTION_TAG);
  await redis.del(EMPLOYEES_ACTION_TAG);
}

// delete
export async function deleteEmployee(id: string) {
  await dbAdmin.collection(EMPLOYEES_ACTION_TAG).doc(id).delete();
  updateTag(EMPLOYEES_ACTION_TAG);
  await redis.del(EMPLOYEES_ACTION_TAG);
}

// get

const _getEmployees = async () => {
  const snapshot = await dbAdmin.collection(EMPLOYEES_ACTION_TAG).get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getEmployees = unstable_cache(
  _getEmployees,
  [EMPLOYEES_ACTION_TAG],
  {
    revalidate: false,
    tags: [EMPLOYEES_ACTION_TAG],
  },
);

// export const getEmployees = async () => {
//   "use cache";

//   cacheTag("employees");

//   const snapshot = await dbAdmin.collection("employees").get();
//   return snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// };
