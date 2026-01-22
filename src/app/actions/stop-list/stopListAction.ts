import { unstable_cache, updateTag } from "next/cache";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";
import { StopListSchemaType } from "@/features/stop-list/schema";
import { supabaseServer } from "@/lib/supabase-server";

export type StopListType = {
  id: string;
  user_email: string;
  form_data: StopListSchemaType;
};
// get
export async function _getStopList() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.from("stop_list_realtime").select("*");
  if (error) {
    console.error("Ошибка при получении данных формы:", error);
    throw error;
  }

  return data;
}

export const getStopList = unstable_cache(_getStopList, ["stopList"], {
  revalidate: false,
  tags: ["stopList"],
});

// create
export async function saveStopList(data: any) {
  const supabase = supabaseServer();
  const { mail, dataStopList } = data;
  const { data: savedData, error } = await supabase
    .from("stop_list_realtime")
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

  updateTag("stopList");
  await invalidateEverywhere("stopList");

  return savedData;
}
