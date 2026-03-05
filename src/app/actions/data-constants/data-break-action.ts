import { DATA_BREAK_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

//create

export type BreakRow = {
  id: string;
  name: string;
  hours: string[];
};
export type createDataBreak = {
  rows: BreakRow[];
};

export async function createDataBreakList(data: createDataBreak) {
  const docRef = dbAdmin
    .collection(DATA_BREAK_ACTION_TAG)
    .doc(DATA_BREAK_ACTION_TAG);

  await docRef.set(data, { merge: true });

  updateTag(DATA_BREAK_ACTION_TAG);
}
export async function _getDataBreakList() {
  const docRef = dbAdmin
    .collection(DATA_BREAK_ACTION_TAG)
    .doc(DATA_BREAK_ACTION_TAG);
  const snap = await docRef.get();

  if (!snap.exists) return null;

  const data = snap.data() as any;

  return data as createDataBreak;
}

export const getDataBreakList = unstable_cache(
  _getDataBreakList,
  [DATA_BREAK_ACTION_TAG],
  {
    revalidate: false,
    tags: [DATA_BREAK_ACTION_TAG],
  },
);
