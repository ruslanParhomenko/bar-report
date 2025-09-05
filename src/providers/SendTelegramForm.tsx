"use client";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSendTelegram } from "@/hooks/use-send-telegram";

import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { SendResetButton } from "@/components/buttons/SendResetButton";

import {
  defaultEmptyValuesBar,
  defaultEmptyValuesCucina,
  defaultValuesZNBar,
  defaultValuesZNCucina,
  OrderListFormType,
} from "@/features/order-list/schemas";

export const OrderListTelegramForm = ({
  children,
  user,
  url,
}: {
  children: React.ReactNode;
  user: string;
  url: string;
}) => {
  const DATA_USER = {
    barTTN: {
      key: "order-ttn-bar",
      default: defaultEmptyValuesBar,
    },
    cucinaTTN: {
      key: "order-ttn-cucina",
      default: defaultEmptyValuesCucina,
    },
    barZN: {
      key: "order-bar",
      default: defaultValuesZNBar,
    },
    cucinaZN: {
      key: "order-cucina",
      default: defaultValuesZNCucina,
    },
  };
  const URL_TELEGRAM = {
    ttn: "/api/send-telegram-ttn",
    zn: "/api/send-telegram-zn",
  };
  type UserKey = keyof typeof DATA_USER;

  const STORAGE_KEY = DATA_USER[user as UserKey]?.key;
  const defaultValues = DATA_USER[user as UserKey]?.default;

  const { sendTelegramMessage } = useSendTelegram();
  const { getValue, setValue, removeValue } =
    useLocalStorageForm<OrderListFormType>(STORAGE_KEY);

  const form = useForm<OrderListFormType>({
    defaultValues: {
      ...defaultValues,
      ...getValue(),
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setValue(value);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setValue]);
  const resetForm = () => {
    form.reset(defaultValues);
    removeValue();
  };

  const sendTextTelegram: SubmitHandler<OrderListFormType> = async (data) => {
    console.log("data", data);
    sendTelegramMessage(
      data,
      URL_TELEGRAM[url as keyof typeof URL_TELEGRAM],
      user
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(sendTextTelegram)}>
        {children}
        <SendResetButton resetForm={resetForm} />
      </form>
    </Form>
  );
};
