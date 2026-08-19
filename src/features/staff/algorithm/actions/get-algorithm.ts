"use server";

import { ALGORITHM_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache } from "next/cache";
import { AlgorithmData } from "../model/schema";

export async function _getAlgorithmData() {
  const doc = await dbAdmin.collection(ALGORITHM_ACTION_TAG).doc("main").get();

  if (!doc.exists) return null;

  return doc.data() as AlgorithmData;
}

export const getAlgorithmData = unstable_cache(
  _getAlgorithmData,
  [ALGORITHM_ACTION_TAG],
  {
    revalidate: false,
    tags: [ALGORITHM_ACTION_TAG],
  },
);
