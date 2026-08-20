"use server";
import { invalidateEverywhere } from "@/app/actions/invalidateEverywhere/invalidate-everywhere";
import { DATA_MENU_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { updateTag } from "next/cache";

type State = {
  success?: boolean;
  error?: string;
};

export async function createDataJson<T extends Record<string, any>>(
  data: T,
  tag: string,
) {
  const docRef = dbAdmin.collection(tag).doc(tag);

  await docRef.set(data);

  if (tag === DATA_MENU_ACTION_TAG) {
    await invalidateEverywhere(tag);
  }

  updateTag(tag);
}

export async function saveSettingsData(
  _: State,
  formData: FormData,
): Promise<State> {
  const raw = formData.get("json");
  const type = formData.get("type")?.toString();
  const tag = formData.get("tag")?.toString();

  if (typeof raw !== "string") {
    return { error: "JSON is required" };
  }

  if (!type) {
    return { error: "Type is required" };
  }

  if (!tag) {
    return { error: "Tag is required" };
  }

  let parsed: any;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: "Invalid JSON format" };
  }

  try {
    await createDataJson(parsed, tag);
    if (tag === "products") {
      await invalidateEverywhere("data-products");
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Save failed" };
  }
}
