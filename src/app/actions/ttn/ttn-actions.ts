"use server";

import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";
import { SuppliersFormType } from "@/features/ttn/schema";
import { TTN_ACTION_TAG } from "@/constants/action-tag";

export type TTNGetDataType = SuppliersFormType & {
  id: string;
};

// create
export async function createTTN(data: SuppliersFormType) {
  const docRef = await dbAdmin.collection(TTN_ACTION_TAG).add({
    unique_key: data.unique_key,
    year: data.year,
    month: data.month,
    rowAOData: data.rowSuppliers,
  });
  updateTag(TTN_ACTION_TAG);

  return docRef.id;
}

// update
export async function updateTTN(id: string, data: SuppliersFormType) {
  await dbAdmin.collection(TTN_ACTION_TAG).doc(id).update(data);
  updateTag(TTN_ACTION_TAG);
}

// get by id
export const _getTTNById = async (id: string) => {
  const doc = await dbAdmin.collection(TTN_ACTION_TAG).doc(id).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  } as TTNGetDataType;
};

export const getAOById = unstable_cache(_getTTNById, [TTN_ACTION_TAG], {
  revalidate: false,
  tags: [TTN_ACTION_TAG],
});

// get by filters
export const _getTTNByUniqueKey = async (unique_key: string) => {
  const snapshot = await dbAdmin
    .collection(TTN_ACTION_TAG)
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
  [TTN_ACTION_TAG],
  {
    revalidate: false,
    tags: [TTN_ACTION_TAG],
  },
);
