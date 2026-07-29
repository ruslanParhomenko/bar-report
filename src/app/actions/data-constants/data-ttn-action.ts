import { DATA_TTN_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = DATA_TTN_ACTION_TAG;

//create

export type CreateDataTTN = {
  agent: string[];
  agentNbm: string[];
};

export async function createDataTTN(data: CreateDataTTN) {
  const docRef = dbAdmin.collection(actionTag).doc(actionTag);

  await docRef.set(data);

  updateTag(actionTag);
}
export async function _getDataTTN() {
  const docRef = dbAdmin.collection(actionTag).doc(actionTag);
  const snap = await docRef.get();

  if (!snap.exists) return { agent: [], agentNbm: [] };

  const data = snap.data() as any;

  return data as CreateDataTTN;
}

export const getDataTTN = unstable_cache(_getDataTTN, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
