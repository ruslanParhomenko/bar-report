"use client";

import { sendTelegramMessage } from "@/app/actions/telegram/telegram-action";

import FormWrapper from "@/components/wrapper/form-wrapper";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { useAbility } from "@/providers/ability-provider";
import { useSession } from "next-auth/react";
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

  const { isTech } = useAbility();

  const { data: session } = useSession();
  const name = session?.user?.name?.split(" ")[0];

  const STORAGE_KEY = `order-new-${tab}`;

  const form = useForm({ defaultValues: {} });

  const { isLoaded } = useLocalStorageForm(form, STORAGE_KEY);

  const onSubmit = async (formData: any) => {
    try {
      const filtered = Object.fromEntries(
        Object.entries(formData)
          .map(([category, items]) => [
            category,
            Object.fromEntries(
              Object.entries((items as Record<string, string>) ?? {}).filter(
                ([key, value]) =>
                  !key.startsWith("__name_") &&
                  !key.endsWith("__day") &&
                  value !== "" &&
                  value !== null &&
                  value !== undefined,
              ),
            ),
          ])
          .filter(([_, items]) => Object.keys(items as object).length > 0),
      ) as Record<string, Record<string, string>>;

      if (Object.keys(filtered).length === 0) {
        toast.error("Нет данных для отправки");
        return;
      }

      await sendTelegramMessage(filtered, tab, name || "");
      toast.success("Заказ отправлен в Telegram!");
    } catch {
      toast.error("Ошибка отправки");
    }
  };

  if (!isLoaded) return null;
  if (isTech && tab !== "tech") return null;
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <div className="columns-1 md:columns-3 lg:columns-5 xl:columns-6">
        {allKeys.map((key) => (
          <div key={key} className="break-inside-avoid">
            <OrderCardWrapper data={data[key]} name={key} />
          </div>
        ))}
      </div>
    </FormWrapper>
  );
};
