"use server";

import { TTN_NBM_ACTION_TAG } from "@/constants/action-tag";

import { TTNFormNBM } from "@/features/ttn/nbm/schema";
import { getYearMonthCollection, getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";

// type
export type TTNDataForm = {
  id: string;
  year: string;
  month: string;
  ttnData: TTNFormNBM;
};

export type GetTtnNbmData = {
  id: string;
  ttnData: TTNFormNBM;
};

const actionTag = TTN_NBM_ACTION_TAG;

// create
export async function createTtnNbm(data: Omit<TTNDataForm, "id">) {
  const { year, month, ttnData } = data;

  const docRef = getYearMonthDoc(actionTag, year, month);
  await docRef.set({ ttnData });

  updateTag(actionTag);
  return docRef.id;
}

// get by month year
export async function _getTtnNbmByYearAndMonth(
  year: string,
  month: string,
): Promise<GetTtnNbmData | null> {
  const docRef = getYearMonthDoc(actionTag, year, month);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return { id: snap.id, ...snap.data() } as GetTtnNbmData;
}

export const getTtnNbmByYearAndMonth = unstable_cache(
  _getTtnNbmByYearAndMonth,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);

// get by year

export async function _getTtnNbmByYear(year: string): Promise<GetTtnNbmData[]> {
  const colRef = getYearMonthCollection(actionTag, year);
  const snap = await colRef.get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GetTtnNbmData[];
}

export const getTtnNbmByYear = unstable_cache(_getTtnNbmByYear, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
