"use server";

import { createDataProducts } from "../data-products-prepare/data-products-action";

type State = {
  success?: boolean;
  error?: string;
};

export async function saveDataProducts(
  _: State,
  formData: FormData,
): Promise<State> {
  const raw = formData.get("json");

  if (!raw || typeof raw !== "string") {
    return { error: "JSON is required" };
  }

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: "Invalid JSON format" };
  }

  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    return { error: "JSON must be an object" };
  }

  await createDataProducts(parsed);

  return { success: true };
}
