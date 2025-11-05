"use server";

import { dbAdmin } from "@/lib/firebaseAdmin";
import { ScheduleType } from "@/features/settings/schedule/schema";
import { invalidateEverywhere } from "./invalidateEverywhere";

export type ScheduleData = ScheduleType & {
  uniqueKey: string;
};

// Создание новой записи расписания
export async function createSchedule(data: ScheduleData) {
  const docRef = await dbAdmin.collection("schedule").add({
    uniqueKey: data.uniqueKey,
    year: data.year,
    month: data.month,
    role: data.role,
    rowShifts: data.rowShifts,
  });

  await invalidateEverywhere("schedule");
  return docRef.id;
}

// Обновление существующей записи расписания
export async function updateSchedule(
  id: string,
  data: Omit<ScheduleData, "id">
) {
  await dbAdmin.collection("schedule").doc(id).update(data);
  await invalidateEverywhere("schedule");
}
