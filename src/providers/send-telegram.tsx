"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  defaultEmptyValuesBar,
  defaultEmptyValuesCucina,
  defaultValuesZNBar,
  defaultValuesZNCucina,
  OrderListFormType,
} from "@/features/orders/schemas";
import { useSendTelegram } from "@/hooks/use-send-telegram";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import FormInput from "@/components/wrapper/form";
import { use, useEffect } from "react";

export const OrderListTelegramForm = ({
  children,
  user,
  url,
  isDisabled,
  ref,
}: {
  children: React.ReactNode;
  user: string;
  url: string;
  isDisabled: boolean;
  ref?: React.RefObject<HTMLDivElement | null> | null;
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

  console.log("user", user);
  const defaultValues = DATA_USER[user as UserKey]?.default;

  console.log("defaultValues", defaultValues);

  const { sendTelegramMessage } = useSendTelegram();

  const form = useForm<OrderListFormType>({
    defaultValues: defaultValues,
  });

  const value = form.watch();
  console.log("value", value);
  const { isLoaded } = useLocalStorageForm(form, STORAGE_KEY);

  const onSubmit: SubmitHandler<OrderListFormType> = async (data) => {
    sendTelegramMessage(
      data,
      URL_TELEGRAM[url as keyof typeof URL_TELEGRAM],
      user,
    );
  };

  if (!isLoaded) return null;

  return (
    <FormInput
      form={form}
      onSubmit={onSubmit}
      resetButton={true}
      disabled={isDisabled}
      className="px-1"
      ref={ref}
      sendTelegram={url === "zn" ? true : false}
      url={url}
    >
      {children}
    </FormInput>
  );
};
