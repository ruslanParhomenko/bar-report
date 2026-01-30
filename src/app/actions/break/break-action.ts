"use server";

import { unstable_cache, updateTag } from "next/cache";
import { BREAK_ACTION_TAG } from "@/constants/action-tag";
import { BreakFormData } from "@/features/break/schema";
import { dbAdmin } from "@/lib/firebase-admin";

const REALTIME_DOC = "break-realtime";

type BreakCreateType = {
  day: string;
  month: string;
  year: string;
  uniqueKey: string;
  rows: BreakFormData["rows"];
};

type BreakData = {
  day: string;
  rows: BreakFormData["rows"];
};
export type BreakGetType = {
  id: string;
  year: string;
  month: string;
  data: BreakData[];
};
// create break list

export async function createBreakList(data: BreakCreateType) {
  const { uniqueKey, ...restData } = data;
  const docRef = dbAdmin.collection(BREAK_ACTION_TAG).doc(uniqueKey);
  const snap = await docRef.get();

  if (!snap.exists) {
    const doc = {
      year: restData.year,
      month: restData.month,
      data: [
        {
          day: restData.day,
          rows: restData.rows,
        },
      ],
    };

    await docRef.set(doc);
    updateTag(BREAK_ACTION_TAG);
    return;
  }

  const raw = snap.data();

  const isDayExists = raw?.data.some(
    (d: BreakCreateType) => d.day === restData.day,
  );

  if (isDayExists) return;
  await docRef.update({
    data: [
      ...raw?.data,
      {
        day: data.day,
        rows: data.rows,
      },
    ],
  });

  updateTag(BREAK_ACTION_TAG);
}

// delete
export async function deleteBreakList(uniqueKey: string, day: string) {
  const docRef = dbAdmin.collection(BREAK_ACTION_TAG).doc(uniqueKey);
  const snap = await docRef.get();

  if (!snap.exists) return;

  const raw = snap.data() as BreakGetType;

  const filtered = raw.data.filter((d) => d.day !== day);

  if (filtered.length === raw.data.length) return;

  await docRef.update({ data: filtered });
  updateTag(BREAK_ACTION_TAG);
}

// get by uniqueKey
export async function _getBreakListByDate(uniqueKey: string) {
  const doc = await dbAdmin.collection(BREAK_ACTION_TAG).doc(uniqueKey).get();

  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  } as BreakGetType;
}

export const getBreakListByDate = unstable_cache(
  _getBreakListByDate,
  [BREAK_ACTION_TAG],
  {
    revalidate: false,
    tags: [BREAK_ACTION_TAG],
  },
);

// realtime

export async function realtimeBreakList(data: BreakFormData) {
  const docRef = dbAdmin.collection("break-realtime").doc(REALTIME_DOC);

  // Полностью перезаписываем документ
  await docRef.set({
    date: data.date,
    rows: data.rows,
  });

  updateTag("break-realtime");
}

export async function getRealtimeBreakList() {
  const docRef = dbAdmin.collection("break-realtime").doc("break-realtime");
  const snap = await docRef.get();

  if (!snap.exists) return null;

  const data = snap.data() as any;

  // Преобразуем Firebase Timestamp в строку ISO
  return {
    ...data,
    date: data.date?.toDate?.()
      ? data.date.toDate().toISOString()
      : new Date().toISOString(),
  } as BreakFormData;
}
