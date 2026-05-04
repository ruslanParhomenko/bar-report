"use server";

import { TTN_ACTION_TAG } from "@/constants/action-tag";
import { TTNForm } from "@/features/ttn/schema";
import { getYearMonthCollection, getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";

// type
export type TTNDataForm = {
  id: string;
  year: string;
  month: string;
  ttnData: TTNForm;
};

export type GetTTNData = {
  id: string;
  ttnData: TTNForm;
};

const actionTag = TTN_ACTION_TAG;

// create
export async function createTTN(data: Omit<TTNDataForm, "id">) {
  const { year, month, ttnData } = data;

  const docRef = getYearMonthDoc(actionTag, year, month);
  await docRef.set({ ttnData });

  updateTag(actionTag);
  return docRef.id;
}

// get by month year
export async function _getTTNByYearAndMonth(
  year: string,
  month: string,
): Promise<GetTTNData | null> {
  const docRef = getYearMonthDoc(actionTag, year, month);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return { id: snap.id, ...snap.data() } as GetTTNData;
}

export const getTTNByYearAndMonth = unstable_cache(
  _getTTNByYearAndMonth,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);

// get by year

export async function _getTTNByYear(year: string): Promise<GetTTNData[]> {
  const colRef = getYearMonthCollection(actionTag, year);
  const snap = await colRef.get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GetTTNData[];
}

export const getTTNByYear = unstable_cache(_getTTNByYear, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
