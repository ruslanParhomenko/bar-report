"use server";

import { dbAdmin } from "@/lib/firebase-admin";
import { EmployeesSchemaTypeData } from "@/features/employees/schema";
import { unstable_cache, updateTag } from "next/cache";
import { redis } from "@/lib/redis";

export type EmployeeData = EmployeesSchemaTypeData;
const EMPLOYEES_KEY = "employees";

// create
export async function createEmployee(data: EmployeeData) {
  const docRef = await dbAdmin.collection(EMPLOYEES_KEY).add({
    name: data.name,
    role: data.role,
    rate: data.rate,
    mail: data.mail,
    tel: data.tel,
    employmentDate: data.employmentDate,
    vacationPay: (data.vacationPay || []).map((pay) => ({
      startDate: pay.startDate,
      endDate: pay.endDate,
      countDays: pay.countDays,
    })),
  });
  updateTag(EMPLOYEES_KEY);
  await redis.del(EMPLOYEES_KEY);
  return docRef.id;
}

// update
export async function updateEmployee(
  id: string,
  data: Omit<EmployeeData, "id">,
) {
  await dbAdmin.collection(EMPLOYEES_KEY).doc(id).update(data);
  updateTag(EMPLOYEES_KEY);
  await redis.del(EMPLOYEES_KEY);
}

// delete
export async function deleteEmployee(id: string) {
  await dbAdmin.collection(EMPLOYEES_KEY).doc(id).delete();
  updateTag(EMPLOYEES_KEY);
  await redis.del(EMPLOYEES_KEY);
}

// get

const _getEmployees = async () => {
  const snapshot = await dbAdmin.collection(EMPLOYEES_KEY).get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getEmployees = unstable_cache(_getEmployees, [EMPLOYEES_KEY], {
  revalidate: false,
  tags: [EMPLOYEES_KEY],
});

// export const getEmployees = async () => {
//   "use cache";

//   cacheTag("employees");

//   const snapshot = await dbAdmin.collection("employees").get();
//   return snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// };
