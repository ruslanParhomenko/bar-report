"use server";

import { dbAdmin } from "@/lib/firebaseAdmin";
import { unstable_cache, revalidateTag } from "next/cache";

// Получение расписания
const _getSchedule = async () => {
  const snapshot = await dbAdmin.collection("schedule").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Кэшированная версия для Server Actions
export const getSchedule = unstable_cache(_getSchedule, ["schedule"], {
  revalidate: false,
  tags: ["schedule"],
});

// Функция для инвалидации кэша
export async function invalidateSchedule() {
  revalidateTag("schedule");
}
