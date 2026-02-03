"use server";
import { REPORT_BAR_ACTION_TAG } from "@/constants/action-tag";
import { ReportBarFormValues } from "@/features/report/bar/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

const REALTIME_DOC = "report-bar-realtime";

type ReportCreateData = {
  day: string;
  report: Omit<ReportBarFormValues, "date">;
};

export type ReportDataByUniqueKey = {
  id: string;
  year: string;
  month: string;
  data: ReportCreateData[];
};
// create
export async function createReportBar(
  uniqueKey: string,
  year: string,
  month: string,
  data: ReportCreateData,
) {
  const docRef = dbAdmin.collection(REPORT_BAR_ACTION_TAG).doc(uniqueKey);
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
    updateTag(REPORT_BAR_ACTION_TAG);
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

  updateTag(REPORT_BAR_ACTION_TAG);
}

// update day
export async function updateReportBar(
  uniqueKey: string,
  day: string,
  report: Omit<ReportBarFormValues, "date">,
) {
  const docRef = dbAdmin.collection(REPORT_BAR_ACTION_TAG).doc(uniqueKey);
  const snap = await docRef.get();

  if (!snap.exists) return;

  const raw = snap.data() as any;

  const isDayExists = raw.data.some((d: any) => d.day === day);
  if (!isDayExists) return;

  const updatedData = raw.data.map((d: any) =>
    d.day === day ? { ...d, report } : d,
  );

  await docRef.update({ data: updatedData });

  updateTag(REPORT_BAR_ACTION_TAG);
}

// get by uniqueKey
async function _getReportByUniqueKey(uniqueKey: string) {
  const doc = await dbAdmin
    .collection(REPORT_BAR_ACTION_TAG)
    .doc(uniqueKey)
    .get();

  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  } as ReportDataByUniqueKey;
}

export const getReportByUniqueKey = unstable_cache(
  _getReportByUniqueKey,
  [REPORT_BAR_ACTION_TAG],
  {
    revalidate: false,
    tags: [REPORT_BAR_ACTION_TAG],
  },
);

// realtime

export async function realtimeReportBar(data: ReportBarFormValues) {
  const docRef = dbAdmin.collection(REALTIME_DOC).doc(REALTIME_DOC);

  await docRef.set(data);

  updateTag(REALTIME_DOC);
}

export async function _getRealtimeReportBar() {
  const docRef = dbAdmin.collection(REALTIME_DOC).doc(REALTIME_DOC);
  const snap = await docRef.get();

  if (!snap.exists) return null;

  const data = snap.data() as any;

  return {
    ...data,
    date: data.date?.toDate?.() ? data.date.toDate() : new Date(),
  } as ReportBarFormValues;
}

export const getRealtimeReportBar = unstable_cache(
  _getRealtimeReportBar,
  [REALTIME_DOC],
  {
    revalidate: false,
    tags: [REALTIME_DOC],
  },
);
