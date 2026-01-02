"use server";

import { dbAdmin } from "@/lib/firebaseAdmin";

import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";
import { unstable_cache, updateTag } from "next/cache";
import { AOFormType } from "@/features/a-o/schema";

export type AOData = AOFormType & {
  uniqueKey: string;
};
export type AOContextValue = AOFormType & {
  id: string;
  uniqueKey: string;
};

// create
export async function createAO(data: AOData) {
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
export async function updateAO(id: string, data: Omit<AOData, "id">) {
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
  } as AOData & { id: string };
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
    .limit(1) // ограничиваем один результат
    .get();

  if (snapshot.empty) return null; // или {}

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...doc.data(),
  } as AOData & { id: string };
};

export const getAOByUniqueKey = unstable_cache(
  _getAOByUniqueKey,
  ["ao-report"],
  {
    revalidate: false,
    tags: ["ao-report"],
  }
);
