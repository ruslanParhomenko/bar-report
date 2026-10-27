"use server";

import { NEWS_ACTION_TAG } from "@/constants/action-tag";
import { NewsData } from "@/features/news/news-edit/model/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache } from "next/cache";

const actionTag = NEWS_ACTION_TAG;

export async function _getNewsData() {
  const doc = await dbAdmin.collection(actionTag).doc("main").get();

  if (!doc.exists) return null;

  return doc.data() as NewsData;
}

export const getNewsData = unstable_cache(_getNewsData, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
