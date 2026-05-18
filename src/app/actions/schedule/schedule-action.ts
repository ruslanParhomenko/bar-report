"use server";

import { SCHEDULE_ACTION_TAG } from "@/constants/action-tag";
import { ScheduleType } from "@/features/schedule/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidate-everywhere";

const actionTag = SCHEDULE_ACTION_TAG;

// type
export type ScheduleDataForm = {
  year: string;
  month: string;
  role: string;
  rowShifts: ScheduleType["rowShifts"];
};

export type GetScheduleData = {
  id: string;
  rowShifts: ScheduleType["rowShifts"];
};

// create
export async function createSchedule(data: ScheduleDataForm) {
  const { year, month, rowShifts, role } = data;

  const docRef = getYearMonthDoc(actionTag, year, month);
  const docRefRole = docRef.collection("role").doc(role);

  await docRefRole.set({ rowShifts });

  updateTag(actionTag);

  await invalidateEverywhere(actionTag);
  return docRef.id;
}

// get by month year
export async function _getScheduleByYearAndMonth(
  year: string,
  month: string,
): Promise<GetScheduleData[] | null> {
  const docRef = dbAdmin
    .collection(actionTag)
    .doc(year)
    .collection("months")
    .doc(month)
    .collection("role");

  const snap = await docRef.get();

  if (snap.empty) return [];

  const data = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data as GetScheduleData[];
}
export const getScheduleByYearAndMonth = unstable_cache(
  _getScheduleByYearAndMonth,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);
