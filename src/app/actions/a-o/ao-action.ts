"use server";

import { AO_REPORT_ACTION_TAG } from "@/constants/action-tag";
import { AoForm } from "@/features/a-o/schema";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";

// type
export type AoDataForm = {
  id: string;
  year: string;
  month: string;
  aoData: AoForm;
};
export type GetAoData = {
  id: string;
  aoData: AoForm;
};

// create
export async function createAO(data: Omit<AoDataForm, "id">) {
  const { year, month, aoData } = data;
  const docRef = getYearMonthDoc(AO_REPORT_ACTION_TAG, year, month);
  await docRef.set({ aoData });
  updateTag(AO_REPORT_ACTION_TAG);
  return docRef.id;
}

// get by month year
export async function _getAOByYearAndMonth(
  year: string,
  month: string,
): Promise<GetAoData | null> {
  const docRef = getYearMonthDoc(AO_REPORT_ACTION_TAG, year, month);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return { id: snap.id, ...snap.data() } as GetAoData;
}

export const getAOByYearAndMonth = unstable_cache(
  _getAOByYearAndMonth,
  [AO_REPORT_ACTION_TAG],
  {
    revalidate: false,
    tags: [AO_REPORT_ACTION_TAG],
  },
);
