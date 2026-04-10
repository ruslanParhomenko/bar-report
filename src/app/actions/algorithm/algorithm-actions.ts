"use server";

import { ALGORITHM_ACTION_TAG } from "@/constants/action-tag";
import { AlgorithmData } from "@/features/algorithm/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

export async function createAlgorithmData(data: AlgorithmData) {
  const docRef = dbAdmin.collection(ALGORITHM_ACTION_TAG).doc("main");

  await docRef.set({
    ...data,
    id: docRef.id,
  });

  updateTag(ALGORITHM_ACTION_TAG);
}

export async function _getAlgorithmData() {
  const doc = await dbAdmin.collection(ALGORITHM_ACTION_TAG).doc("main").get();

  if (!doc.exists) return null;

  return doc.data();
}

export const getAlgorithmData = unstable_cache(
  _getAlgorithmData,
  [ALGORITHM_ACTION_TAG],
  {
    revalidate: false,
    tags: [ALGORITHM_ACTION_TAG],
  },
);
