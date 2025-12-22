"use server";

import { TipsFormType } from "@/features/tips/schema";
import { supabase } from "@/lib/supabaseClient";

import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";
import { unstable_cache, updateTag } from "next/cache";

// type
export type TipsData = {
  id: number;
  unique_id: string;
  form_data: TipsFormType;
  created_at: string;
};

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
  updateTag("tips");
  invalidateEverywhere("tips");

  return savedData;
}

// get by unique_id
export async function _getTipsFormById(unique_id: string) {
  const { data, error } = await supabase
    .from("tips")
    .select("*")
    .eq("unique_id", unique_id)
    .maybeSingle();

  if (error) {
    console.error("Ошибка при получении данных формы:", error);
    throw error;
  }

  return data ?? null;
}

export const getTipsFormById = unstable_cache(_getTipsFormById, ["tips"], {
  revalidate: false,
  tags: ["tips"],
});
