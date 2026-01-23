"use server";

import { TipsFormType } from "@/features/tips/schema";
import { supabase } from "@/lib/supabase-client";

import { unstable_cache, updateTag } from "next/cache";
import { TIPS_ACTION_TAG } from "@/constants/action-tag";

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

  const { data: savedData, error } = await supabase
    .from(TIPS_ACTION_TAG)
    .upsert(
      {
        unique_id: unique_id,
        form_data: data,
      },
      { onConflict: "unique_id" },
    );

  if (error) {
    console.error("Ошибка при сохранении формы:", error);
    throw error;
  }
  updateTag(TIPS_ACTION_TAG);

  return savedData;
}

// get by unique_id
export async function _getTipsFormById(unique_id: string) {
  const { data, error } = await supabase
    .from(TIPS_ACTION_TAG)
    .select("*")
    .eq("unique_id", unique_id)
    .maybeSingle();

  if (error) {
    console.error("Ошибка при получении данных формы:", error);
    throw error;
  }

  return data ?? null;
}

export const getTipsFormById = unstable_cache(
  _getTipsFormById,
  [TIPS_ACTION_TAG],
  {
    revalidate: false,
    tags: [TIPS_ACTION_TAG],
  },
);
