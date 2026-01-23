"use server";

import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";
import { AOFormTypeInput } from "@/features/a-o/schema";
import { AO_REPORT_ACTION_TAG } from "@/constants/action-tag";

export type AOContextValue = AOFormTypeInput & {
  id: string;
};

// create
export async function createAO(data: AOFormTypeInput) {
  const docRef = await dbAdmin.collection(AO_REPORT_ACTION_TAG).add({
    uniqueKey: data.uniqueKey,
    year: data.year,
    month: data.month,
    rowAOData: data.rowAOData,
  });
  updateTag(AO_REPORT_ACTION_TAG);
  return docRef.id;
}

// update
export async function updateAO(id: string, data: AOFormTypeInput) {
  await dbAdmin.collection(AO_REPORT_ACTION_TAG).doc(id).update(data);
  updateTag(AO_REPORT_ACTION_TAG);
}

// get by id
export const _getAOById = async (id: string) => {
  const doc = await dbAdmin.collection(AO_REPORT_ACTION_TAG).doc(id).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  } as AOContextValue;
};

export const getAOById = unstable_cache(_getAOById, [AO_REPORT_ACTION_TAG], {
  revalidate: false,
  tags: [AO_REPORT_ACTION_TAG],
});

// get by filters
export const _getAOByUniqueKey = async (uniqueKey: string) => {
  const snapshot = await dbAdmin
    .collection(AO_REPORT_ACTION_TAG)
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
  [AO_REPORT_ACTION_TAG],
  {
    revalidate: false,
    tags: [AO_REPORT_ACTION_TAG],
  },
);
