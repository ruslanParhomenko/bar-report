"use server";

import { ScheduleType } from "@/features/settings/schedule/schema";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { invalidateEverywhere } from "./invalidateEverywhere";

export type ScheduleData = ScheduleType & {
  uniqueKey: string;
};

export async function createSchedule(data: ScheduleData) {
  const docRef = await addDoc(collection(db, "schedule"), {
    uniqueKey: data.uniqueKey,
    year: data.year,
    month: data.month,
    role: data.role,
    rowShifts: data.rowShifts,
  });
  await invalidateEverywhere("schedule");
  return docRef.id;
}

export async function updateSchedule(
  id: string,
  data: Omit<ScheduleData, "id">
) {
  await updateDoc(doc(db, "schedule", id), data);
  await invalidateEverywhere("schedule");
}
