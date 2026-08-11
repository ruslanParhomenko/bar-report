"use server";

import { redis } from "@/lib/redis";
import { updateTag } from "next/cache";

export async function invalidateCache(tag: string) {
  updateTag(tag);

  await redis.del(tag);
  await redis.publish("cache:invalidate", tag);
}
