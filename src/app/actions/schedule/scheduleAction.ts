"use server";

import { ScheduleType } from "@/features/settings/schedule/schema";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { revalidateTag } from "next/cache";

export type ScheduleData = ScheduleType & {
  uniqueKey: string;
};

export async function createSchedule(data: ScheduleData) {
  console.log(data);

  const docRef = await addDoc(collection(db, "schedule"), {
    uniqueKey: data.uniqueKey,
    year: data.year,
    month: data.month,
    role: data.role,
    rowShifts: data.rowShifts,
  });
  revalidateTag("schedule");
  return docRef.id;
}
