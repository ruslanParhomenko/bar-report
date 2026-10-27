"use client";

import { NewsEdit } from "@/features/news/news-edit";
import { NewsData } from "@/features/news/news-edit/model/schema";
import { NewsView } from "@/features/news/news-view";
import { useEdit } from "@/providers/edit-provider";

export function NewsPage({ data }: { data: NewsData | null }) {
  const { isEdit } = useEdit();

  if (isEdit) return <NewsEdit data={data} />;

  return <NewsView data={data} />;
}
