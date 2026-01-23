"use server";
import { updateTag } from "next/cache";

export async function revalidateNav(tag: string) {
  updateTag(tag);
}
