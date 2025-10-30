"use server";

import { revalidateTag } from "next/cache";

export async function invalidateScheduleEverywhere() {
  const tag = "schedule";
  const secret = process.env.REVALIDATE_SECRET!;

  // локальная инвалидция
  revalidateTag(tag);

  // список твоих деплоев (можно добавить ngrok при локальной разработке)
  const endpoints = [
    "https://report-bar-n.netlify.app/api/revalidate",
    "https://bar-report2.vercel.app/api/revalidate",
    "https://bar-report-rus.vercel.app/api/revalidate",
    "https://schedule-nuovo.vercel.app/api/revalidate",
  ];

  await Promise.allSettled(
    endpoints.map((url) =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, tag }),
      })
    )
  );
}
