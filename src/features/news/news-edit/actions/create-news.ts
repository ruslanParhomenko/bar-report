"use server";

import { NEWS_ACTION_TAG } from "@/constants/action-tag";
import { NewsData } from "@/features/news/news-edit/model/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { updateTag } from "next/cache";

const actionTag = NEWS_ACTION_TAG;

export async function createNews(data: NewsData) {
  const docRef = dbAdmin.collection(actionTag).doc("main");

  await docRef.set({
    ...data,
    id: docRef.id,
  });

  updateTag(actionTag);
}
