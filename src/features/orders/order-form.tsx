"use client";

import {
  sendTelegramMessage,
  sendTelegramPhoto,
} from "@/app/actions/telegram/telegram-action";
import { Form } from "@/components/ui/form";

import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { useEdit } from "@/providers/edit-provider";
import { createOrderScreenshot } from "@/utils/create-screenshot";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import OrderCardWrapper from "./order-card-wrapper";

export const OrderForm = ({
  data,
  tab,
}: {
  data: Record<string, string[]>;
  tab: string;
}) => {
  const allKeys = Object.keys(data || {});

  const pathname = usePathname();
  const formId = pathname.split("/")[1] || "";

  const { registerReset } = useEdit();

  const STORAGE_KEY = `order-new-${tab}`;

  const form = useForm({ defaultValues: {} });

  const value = form.watch();

  console.log("Form values changed:", value);

  const { isLoaded, resetForm } = useLocalStorageForm(form, STORAGE_KEY);

  const SCREENSHOT_PATCHES = ["cucina-zn"];

  const onSubmit = async (formData: any) => {
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
      ) as Record<string, Record<string, string>>;

      if (Object.keys(filtered).length === 0) {
        toast.error("Нет данных для отправки");
        return;
      }

      if (SCREENSHOT_PATCHES.includes(tab)) {
        const base64 = await createOrderScreenshot(filtered, tab);
        await sendTelegramPhoto(base64, tab);
      } else {
        await sendTelegramMessage(filtered, tab);
      }
      toast.success("Заказ отправлен в Telegram!");
    } catch {
      toast.error("Ошибка отправки");
    }
  };

  const reset = () => {
    resetForm({});
    form.reset({});

    toast.success("Форма сброшена");
  };

  useEffect(() => {
    registerReset(reset);
  }, []);

  if (!isLoaded) return null;

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="columns-1 md:columns-3 lg:columns-4 xl:columns-6">
          {allKeys.map((key) => (
            <div key={key} className="mb-4 break-inside-avoid">
              <OrderCardWrapper data={data[key]} name={key} />
            </div>
          ))}
        </div>
      </form>
    </Form>
  );
};
