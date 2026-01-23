"use server";
import { unstable_cache, updateTag } from "next/cache";
import { StopListSchemaType } from "@/features/stop-list/schema";
import { supabaseServer } from "@/lib/supabase-server";
import { STOP_LIST_ACTION_TAG } from "@/constants/action-tag";

export type StopListType = {
  id: string;
  user_email: string;
  form_data: StopListSchemaType;
};
// get
export async function _getStopList() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.from(STOP_LIST_ACTION_TAG).select("*");
  if (error) {
    console.error("Ошибка при получении данных формы:", error);
    throw error;
  }

  return data;
}

export const getStopList = unstable_cache(
  _getStopList,
  [STOP_LIST_ACTION_TAG],
  {
    revalidate: false,
    tags: [STOP_LIST_ACTION_TAG],
  },
);

// create
export async function saveStopList(data: any) {
  const supabase = supabaseServer();
  const { mail, dataStopList } = data;
  const { data: savedData, error } = await supabase
    .from(STOP_LIST_ACTION_TAG)
    .upsert(
      {
        user_email: mail,
        form_data: dataStopList,
      },
      { onConflict: "user_email" },
    );

  if (error) {
    console.error("Ошибка при сохранении формы:", error);
    throw error;
  }

  updateTag(STOP_LIST_ACTION_TAG);
  return savedData;
}
