"use server";
import {
  FIN_BAR_ACTION_TAG,
  FIN_CASH_ACTION_TAG,
} from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache } from "next/cache";
import { GetFinData } from "../model/type";

// type

const TAG = FIN_CASH_ACTION_TAG;
const TAG_BAR = FIN_BAR_ACTION_TAG;

// get by year  nori
export async function _getFinByYear(year: string) {
  const colRef = dbAdmin.collection(TAG).doc(year);

  const snap = await colRef.get();

  if (!snap.exists) return null;

  return {
    id: snap.id,
    ...snap.data(),
  } as GetFinData;
}

export const getFinByYear = unstable_cache(_getFinByYear, [TAG, "year"], {
  revalidate: false,
  tags: [TAG],
});

// bar

export async function _getFinBarByYear(year: string) {
  const colRef = dbAdmin.collection(TAG_BAR).doc(year);

  const snap = await colRef.get();

  if (!snap.exists) return null;

  return {
    id: snap.id,
    ...snap.data(),
  } as GetFinData;
}

export const getFinBarByYear = unstable_cache(
  _getFinBarByYear,
  [TAG_BAR, "year"],
  {
    revalidate: false,
    tags: [TAG_BAR],
  },
);
