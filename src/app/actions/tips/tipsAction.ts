"use server";

import { TipsFormType } from "@/features/tips/schema";
import { supabase } from "@/lib/supabaseClient";
import { revalidateTag } from "next/cache";

export async function saveTipsForm(data: TipsFormType) {
  const { year, month } = data;

  if (!year || !month) {
    throw new Error("Year или month отсутствуют в данных формы");
  }

  const unique_id = `${year}_${month}`;

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

  await revalidateTag("tips");

  return savedData;
}
