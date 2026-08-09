"use server";

import { EMPLOYEES_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache } from "next/cache";
import { Employee } from "../model/type";


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
