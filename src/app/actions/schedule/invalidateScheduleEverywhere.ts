"use server";

import { revalidateTag } from "next/cache";

export async function invalidateScheduleEverywhere(tag: string) {
  console.log(tag);
  revalidateTag(tag);

  const endpoints = [
    "http://localhost:3000/api/revalidate",
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
        body: JSON.stringify(tag),
      })
    )
  );
}
