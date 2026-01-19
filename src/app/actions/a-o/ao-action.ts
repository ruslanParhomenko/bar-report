"use server";

import { dbAdmin } from "@/lib/firebase-admin";

import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";
import { unstable_cache, updateTag } from "next/cache";
import { AOFormTypeInput } from "@/features/a-o/schema";

export type AOContextValue = AOFormTypeInput & {
  id: string;
};

// create
export async function createAO(data: AOFormTypeInput) {
  const docRef = await dbAdmin.collection("ao-report").add({
    uniqueKey: data.uniqueKey,
    year: data.year,
    month: data.month,
    rowAOData: data.rowAOData,
  });
  updateTag("ao-report");
  await invalidateEverywhere("ao-report");
  return docRef.id;
}

// update
export async function updateAO(id: string, data: AOFormTypeInput) {
  await dbAdmin.collection("ao-report").doc(id).update(data);
  updateTag("ao-report");
  await invalidateEverywhere("ao-report");
}

// get by id
export const _getAOById = async (id: string) => {
  const doc = await dbAdmin.collection("ao-report").doc(id).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  } as AOContextValue;
};

export const getAOById = unstable_cache(_getAOById, ["ao-report"], {
  revalidate: false,
  tags: ["ao-report"],
});

// get by filters
export const _getAOByUniqueKey = async (uniqueKey: string) => {
  const snapshot = await dbAdmin
    .collection("ao-report")
    .where("uniqueKey", "==", uniqueKey)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...doc.data(),
  } as AOContextValue;
};

export const getAOByUniqueKey = unstable_cache(
  _getAOByUniqueKey,
  ["ao-report"],
  {
    revalidate: false,
    tags: ["ao-report"],
  },
);
