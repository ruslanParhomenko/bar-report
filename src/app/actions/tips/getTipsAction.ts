"use server";

import { supabase } from "@/lib/supabaseClient";
import { unstable_cache } from "next/cache";

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
