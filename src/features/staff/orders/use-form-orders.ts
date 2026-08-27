"use client";
import { sendTelegramMessage } from "@/app/actions/telegram/telegram-action";
import { createOrder } from "@/features/staff/orders/actions/create-order";
import { FormDataOrders } from "@/features/staff/orders/model/type";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function useFormOrders(tab: string) {
  const form = useForm({ defaultValues: {} });

  const onSubmit = async (formData: FormDataOrders) => {
    const nowDate = new Date();
    try {
      const filtered = Object.fromEntries(
        Object.entries(formData)
          .map(([category, items]) => [
            category,
            Object.fromEntries(
              Object.entries((items as Record<string, string>) ?? {}).filter(
                ([_, value]) =>
                  value !== "" && value !== null && value !== undefined,
              ),
            ),
          ])
          .filter(([_, items]) => Object.keys(items as object).length > 0),
      ) as FormDataOrders;

      if (Object.keys(filtered).length === 0) {
        toast.error("Нет данных для отправки");
        return;
      }

      await sendTelegramMessage(filtered, tab);

      await createOrder({
        tab,
        year: nowDate.getFullYear().toString(),
        month: (nowDate.getMonth() + 1).toString(),
        day: nowDate.getDate().toString(),
        orders: filtered,
      });
      toast.success("Заказ отправлен в Telegram!");
    } catch {
      toast.error("Ошибка отправки");
    }
  };
  return {
    form,
    onSubmit,
  };
}
