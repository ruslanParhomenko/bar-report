"use server";

import { ALGORITHM_ACTION_TAG } from "@/constants/action-tag";
import { AlgorithmData } from "@/features/algorithm/model/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { updateTag } from "next/cache";

export async function createAlgorithmData(data: AlgorithmData, tab: string) {
  const docRef = dbAdmin.collection(ALGORITHM_ACTION_TAG).doc("main");

  await docRef.set(
    {
      [tab]: data[tab],
    },
    { merge: true },
  );

  updateTag(ALGORITHM_ACTION_TAG);
}
