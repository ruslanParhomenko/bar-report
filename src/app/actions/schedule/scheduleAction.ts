"use server";

import { dbAdmin } from "@/lib/firebase-admin";
import { ScheduleType } from "@/features/schedule/create/schema";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";
import { unstable_cache, updateTag } from "next/cache";

export type ScheduleData = ScheduleType & {
  uniqueKey: string;
};
export type SchedulesContextValue = ScheduleType & {
  id: string;
  uniqueKey: string;
};

// create
export async function createSchedule(data: ScheduleData) {
  const docRef = await dbAdmin.collection("schedule").add({
    uniqueKey: data.uniqueKey,
    year: data.year,
    month: data.month,
    role: data.role,
    rowShifts: data.rowShifts,
  });
  updateTag("schedule");
  await invalidateEverywhere("schedule");
  return docRef.id;
}

// update
export async function updateSchedule(
  id: string,
  data: Omit<ScheduleData, "id">,
) {
  await dbAdmin.collection("schedule").doc(id).update(data);
  updateTag("schedule");
  await invalidateEverywhere("schedule");
}

// get by id
export const _getScheduleById = async (id: string) => {
  const doc = await dbAdmin.collection("schedule").doc(id).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  } as ScheduleData & { id: string };
};

export const getScheduleById = unstable_cache(_getScheduleById, ["schedule"], {
  revalidate: false,
  tags: ["schedule"],
});

// get by filters
export const _getScheduleByMonthYear = async (month: string, year: string) => {
  const snapshot = await dbAdmin
    .collection("schedule")
    .where("month", "==", month)
    .where("year", "==", year)
    .get();

  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (ScheduleData & { id: string })[];
};

export const getScheduleByMonthYear = unstable_cache(
  _getScheduleByMonthYear,
  ["schedule"],
  {
    revalidate: false,
    tags: ["schedule"],
  },
);
