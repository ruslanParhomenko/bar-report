"use server";
import { EmployeesSchemaTypeData } from "@/features/settings/schema";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { revalidateTag } from "next/cache";

export type UserData = EmployeesSchemaTypeData;

export async function createEmployee(data: UserData) {
  const docRef = await addDoc(collection(db, "employees"), {
    name: data.name,
    role: data.role,
    rate: data.rate,
    employmentDate: data.employmentDate,
    vacationPay: (data.vacationPay || []).map((pay: any) => ({
      startDate: pay.startDate,
      endDate: pay.endDate,
      countDays: pay.countDays,
    })),
  });
  revalidateTag("employees");
  return docRef.id;
}

export async function updateEmployee(id: string, data: Omit<UserData, "id">) {
  console.log(data);
  await updateDoc(doc(db, "employees", id), data);
  revalidateTag("employees");
}

export async function deleteEmployee(id: string) {
  await deleteDoc(doc(db, "employees", id));
  revalidateTag("employees");
}
