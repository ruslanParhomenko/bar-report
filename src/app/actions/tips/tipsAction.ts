"use server";

import { TipsFormType } from "@/features/tips/schema";
import { supabase } from "@/lib/supabaseClient";

import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";
import { unstable_cache } from "next/cache";

// create
export async function saveTipsForm(data: Omit<TipsFormType, "cashTips">) {
  const { year, month } = data;

  if (!year || !month) {
    throw new Error("Year или month отсутствуют в данных формы");
  }

  const unique_id = `${year}-${month}`;

  const { data: savedData, error } = await supabase.from("tips").upsert(
    {
      unique_id: unique_id,
      form_data: data,
    },
    { onConflict: "unique_id" }
  );

  if (error) {
    console.error("Ошибка при сохранении формы:", error);
    throw error;
  }

  await invalidateEverywhere("tips");

  return savedData;
}

// get

export async function _getTipsForm() {
  const { data, error } = await supabase
    .from("tips")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка при получении данных формы:", error);
    throw error;
  }

  return data;
}

export const getTipsForm = unstable_cache(_getTipsForm, ["tips"], {
  revalidate: false,
  tags: ["tips"],
});
