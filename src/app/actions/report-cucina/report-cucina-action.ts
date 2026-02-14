"use server";
import {
  CUCINA_REALTIME_ACTION_TAG,
  REPORT_CUCINA_ACTION_TAG,
} from "@/constants/action-tag";

import { ReportCucinaType } from "@/features/cucina/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

type ReportCreateData = {
  day: string;
  report: Omit<ReportCucinaType, "date">;
};

export type ReportCucinaDataByUniqueKey = {
  id: string;
  year: string;
  month: string;
  data: ReportCreateData[];
};
// create
export async function createReportCucina(
  uniqueKey: string,
  year: string,
  month: string,
  data: ReportCreateData,
) {
  const docRef = dbAdmin.collection(REPORT_CUCINA_ACTION_TAG).doc(uniqueKey);
  const snap = await docRef.get();

  if (!snap.exists) {
    const doc = {
      year: year,
      month: month,
      data: [
        {
          day: data.day,
          report: data.report,
        },
      ],
    };

    await docRef.set(doc);
    updateTag(REPORT_CUCINA_ACTION_TAG);
    return;
  }

  const raw = snap.data();

  const isDayExists = raw?.data.some(
    (d: ReportCreateData) => d.day === data.day,
  );

  if (isDayExists) return;

  await docRef.update({
    data: [
      ...raw?.data,
      {
        day: data.day,
        report: data.report,
      },
    ],
  });

  updateTag(REPORT_CUCINA_ACTION_TAG);
}

// update day
export async function updateReportCucina(
  uniqueKey: string,
  day: string,
  report: Omit<ReportCucinaType, "date">,
) {
  const docRef = dbAdmin.collection(REPORT_CUCINA_ACTION_TAG).doc(uniqueKey);
  const snap = await docRef.get();

  if (!snap.exists) return;

  const raw = snap.data() as any;

  const isDayExists = raw.data.some((d: any) => d.day === day);
  if (!isDayExists) return;

  const updatedData = raw.data.map((d: any) =>
    d.day === day ? { ...d, report } : d,
  );

  await docRef.update({ data: updatedData });

  updateTag(REPORT_CUCINA_ACTION_TAG);
}

// get by uniqueKey
async function _getReportCucinaByUniqueKey(uniqueKey: string) {
  const doc = await dbAdmin
    .collection(REPORT_CUCINA_ACTION_TAG)
    .doc(uniqueKey)
    .get();

  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  } as ReportCucinaDataByUniqueKey;
}

export const getReportCucinaByUniqueKey = unstable_cache(
  _getReportCucinaByUniqueKey,
  [REPORT_CUCINA_ACTION_TAG],
  {
    revalidate: false,
    tags: [REPORT_CUCINA_ACTION_TAG],
  },
);

// realtime

export async function realtimeReportCucina(data: ReportCucinaType) {
  const docRef = dbAdmin
    .collection(CUCINA_REALTIME_ACTION_TAG)
    .doc(CUCINA_REALTIME_ACTION_TAG);

  await docRef.set(data);

  updateTag(CUCINA_REALTIME_ACTION_TAG);
}

export async function _getRealtimeReportCucina() {
  const docRef = dbAdmin
    .collection(CUCINA_REALTIME_ACTION_TAG)
    .doc(CUCINA_REALTIME_ACTION_TAG);
  const snap = await docRef.get();

  if (!snap.exists) return null;

  const data = snap.data() as any;

  return {
    ...data,
    date: data.date?.toDate?.() ? data.date.toDate() : new Date(),
  } as ReportCucinaType;
}

export const getRealtimeReportCucina = unstable_cache(
  _getRealtimeReportCucina,
  [CUCINA_REALTIME_ACTION_TAG],
  {
    revalidate: false,
    tags: [CUCINA_REALTIME_ACTION_TAG],
  },
);
