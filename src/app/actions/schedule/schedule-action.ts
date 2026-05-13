"use server";

import { SCHEDULE_ACTION_TAG } from "@/constants/action-tag";
import { ScheduleType } from "@/features/schedule/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidate-everywhere";

export type ScheduleData = ScheduleType & {
  uniqueKey: string;
  year: string;
  month: string;
  role: string;
};
export type SchedulesContextValue = ScheduleData & {
  id: string;
};

// create
export async function createSchedule(data: ScheduleData) {
  const docRef = await dbAdmin.collection(SCHEDULE_ACTION_TAG).add({
    uniqueKey: data.uniqueKey,
    year: data.year,
    month: data.month,
    role: data.role,
    rowShifts: data.rowShifts,
  });
  updateTag(SCHEDULE_ACTION_TAG);
  await invalidateEverywhere(SCHEDULE_ACTION_TAG);
  return docRef.id;
}

// update
export async function updateSchedule(
  id: string,
  data: Omit<ScheduleData, "id">,
) {
  await dbAdmin.collection(SCHEDULE_ACTION_TAG).doc(id).update(data);
  updateTag(SCHEDULE_ACTION_TAG);
  await invalidateEverywhere(SCHEDULE_ACTION_TAG);
}

// get by id
export const _getScheduleById = async (id: string) => {
  const doc = await dbAdmin.collection(SCHEDULE_ACTION_TAG).doc(id).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  } as ScheduleData & { id: string };
};

export const getScheduleById = unstable_cache(
  _getScheduleById,
  [SCHEDULE_ACTION_TAG],
  {
    revalidate: false,
    tags: [SCHEDULE_ACTION_TAG],
  },
);

// get by filters
export const _getScheduleByMonthYear = async (month: string, year: string) => {
  const snapshot = await dbAdmin
    .collection(SCHEDULE_ACTION_TAG)
    .where("month", "==", month)
    .where("year", "==", year)
    .get();

  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (ScheduleData & { id: string })[];
};

export const getScheduleByMonthYear = async (month: string, year: string) =>
  unstable_cache(
    () => _getScheduleByMonthYear(month, year),
    [SCHEDULE_ACTION_TAG, month, year],
    { revalidate: false, tags: [SCHEDULE_ACTION_TAG] },
  )();
