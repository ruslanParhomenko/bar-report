"use server";

import { unstable_cache, updateTag } from "next/cache";
import { REMARKS_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { RemarkFormData, RemarksFormData } from "@/features/bar/penalty/schema";

const REALTIME_DOC = "remarks-realtime";

type RemarksCreateType = Omit<RemarksFormData, "date"> & {
  day: string;
  month: string;
  year: string;
};

export type RemarksData = {
  day: string;
  remarks: RemarkFormData[];
};
export type RemarksDataByUniqueKey = {
  id: string;
  year: string;
  month: string;
  data: RemarksData[];
};
export async function createRemarks(
  uniqueKey: string,
  data: RemarksCreateType,
) {
  const docRef = dbAdmin.collection(REMARKS_ACTION_TAG).doc(uniqueKey);
  const snap = await docRef.get();

  if (!snap.exists) {
    const doc = {
      year: data.year,
      month: data.month,
      data: [
        {
          day: data.day,
          remarks: data.remarks,
        },
      ],
    };

    await docRef.set(doc);
    updateTag(REMARKS_ACTION_TAG);
    return;
  }

  const raw = snap.data();

  const isDayExists = raw?.data.some((d: RemarksData) => d.day === data.day);

  if (isDayExists) return;

  await docRef.update({
    data: [
      ...raw?.data,
      {
        day: data.day,
        remarks: data.remarks,
      },
    ],
  });

  updateTag(REMARKS_ACTION_TAG);
}

// update day
export async function updateRemarks(
  uniqueKey: string,
  day: string,
  remarks: any[],
) {
  const docRef = dbAdmin.collection(REMARKS_ACTION_TAG).doc(uniqueKey);
  const snap = await docRef.get();

  if (!snap.exists) return;

  const raw = snap.data() as any;

  const isDayExists = raw.data.some((d: any) => d.day === day);
  if (!isDayExists) return;

  const updatedData = raw.data.map((d: any) =>
    d.day === day ? { ...d, remarks } : d,
  );

  await docRef.update({ data: updatedData });

  updateTag(REMARKS_ACTION_TAG);
}

// delete BY DAY
export async function deleteRemarksDay(uniqueKey: string, day: string) {
  const docRef = dbAdmin.collection(REMARKS_ACTION_TAG).doc(uniqueKey);
  const snap = await docRef.get();

  if (!snap.exists) return;

  const raw = snap.data() as any;

  const filtered = raw.data.filter((d: any) => d.day !== day);

  if (filtered.length === raw.data.length) return;

  await docRef.update({ data: filtered });

  updateTag(REMARKS_ACTION_TAG);
}

// get by uniqueKey
async function _getRemarksByUniqueKey(uniqueKey: string) {
  const doc = await dbAdmin.collection(REMARKS_ACTION_TAG).doc(uniqueKey).get();

  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  } as RemarksDataByUniqueKey;
}

export const getRemarksByUniqueKey = unstable_cache(
  _getRemarksByUniqueKey,
  [REMARKS_ACTION_TAG],
  {
    revalidate: false,
    tags: [REMARKS_ACTION_TAG],
  },
);

// get by uniqueKey day

export async function getRemarksByDay(uniqueKey: string, day: string) {
  const doc = await dbAdmin.collection(REMARKS_ACTION_TAG).doc(uniqueKey).get();

  if (!doc.exists) return null;

  const raw = doc.data();

  const dayData = raw?.data.find((d: any) => d.day === day);

  return dayData ?? null;
}

// realtime

export async function realtimeRemarksList(data: RemarksFormData) {
  const docRef = dbAdmin.collection(REALTIME_DOC).doc(REALTIME_DOC);

  await docRef.set({
    remarks: data.remarks,
  });

  updateTag(REALTIME_DOC);
}

export async function _getRealtimeRemarksList() {
  const docRef = dbAdmin.collection(REALTIME_DOC).doc(REALTIME_DOC);
  const snap = await docRef.get();

  if (!snap.exists) return null;

  const data = snap.data() as any;

  return {
    ...data,
    date: data.date?.toDate?.() ? data.date.toDate() : new Date(),
  } as RemarksFormData;
}

export const getRealtimeRemarksList = unstable_cache(
  _getRealtimeRemarksList,
  [REALTIME_DOC],
  {
    revalidate: false,
    tags: [REALTIME_DOC],
  },
);
