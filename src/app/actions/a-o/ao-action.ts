"use server";

import { AO_REPORT_ACTION_TAG } from "@/constants/action-tag";
import { AoForm } from "@/features/a-o/schema";
import { getYearMonthCollection, getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = AO_REPORT_ACTION_TAG;

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
  const docRef = getYearMonthDoc(actionTag, year, month);
  await docRef.set({ aoData });
  updateTag(actionTag);
  return docRef.id;
}

// get by month
export async function _getAOByYearAndMonth(
  year: string,
  month: string,
): Promise<GetAoData | null> {
  const docRef = getYearMonthDoc(actionTag, year, month);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return { id: snap.id, ...snap.data() } as GetAoData;
}

export const getAOByYearAndMonth = unstable_cache(
  _getAOByYearAndMonth,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);

// get by year

export async function _getAOByYear(year: string): Promise<GetAoData[]> {
  const colRef = getYearMonthCollection(actionTag, year);
  const snap = await colRef.get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GetAoData[];
}

export const getAOByYear = unstable_cache(_getAOByYear, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
