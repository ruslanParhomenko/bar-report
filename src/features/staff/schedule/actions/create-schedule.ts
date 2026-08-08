"use server";

import { invalidateEverywhere } from "@/app/actions/invalidateEverywhere/invalidate-everywhere";
import { SCHEDULE_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { ScheduleDataForm } from "../model/type";
import { updateTag } from "next/cache";

const actionTag = SCHEDULE_ACTION_TAG;

export async function createSchedule(data: ScheduleDataForm) {
  const { year, month, rowShifts, role } = data;

  const docRef = getYearMonthDoc(actionTag, year, month);
  const docRefRole = docRef.collection("role").doc(role);

  await docRefRole.set({ rowShifts });

  updateTag(actionTag);

  await invalidateEverywhere(actionTag);
  return docRef.id;
}





