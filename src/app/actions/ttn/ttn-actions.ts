"use server";

import { dbAdmin } from "@/lib/firebaseAdmin";

import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";
import { unstable_cache, updateTag } from "next/cache";
import { SuppliersFormType } from "@/features/ttn/schema";

export type TTNGetDataType = SuppliersFormType & {
  id: string;
};

// create
export async function createTTN(data: SuppliersFormType) {
  const docRef = await dbAdmin.collection("ttn-report").add({
    unique_key: data.unique_key,
    year: data.year,
    month: data.month,
    rowAOData: data.rowSuppliers,
  });
  updateTag("ttn-report");
  await invalidateEverywhere("ttn-report");
  return docRef.id;
}

// update
export async function updateTTN(id: string, data: SuppliersFormType) {
  await dbAdmin.collection("ttn-report").doc(id).update(data);
  updateTag("ttn-report");
  await invalidateEverywhere("ttn-report");
}

// get by id
export const _getTTNById = async (id: string) => {
  const doc = await dbAdmin.collection("ttn-report").doc(id).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  } as TTNGetDataType;
};

export const getAOById = unstable_cache(_getTTNById, ["ttn-report"], {
  revalidate: false,
  tags: ["ttn-report"],
});

// get by filters
export const _getTTNByUniqueKey = async (unique_key: string) => {
  const snapshot = await dbAdmin
    .collection("ttn-report")
    .where("unique_key", "==", unique_key)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...doc.data(),
  } as TTNGetDataType;
};

export const getTTNByUniqueKey = unstable_cache(
  _getTTNByUniqueKey,
  ["ttn-report"],
  {
    revalidate: false,
    tags: ["ttn-report"],
  }
);
