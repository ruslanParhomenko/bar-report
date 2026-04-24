"use client";
import { SubmitHandler, useForm } from "react-hook-form";

import { createDataOrderProducts } from "@/app/actions/data-constants/data-order-products";
import FormInput from "@/components/wrapper/form";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { useSendTelegram } from "@/hooks/use-send-telegram";
export const OrderListTelegramForm = ({
  children,
  defaultValues,
  user,
  url,
  isDisabled,
  ref,
}: {
  children: React.ReactNode;
  defaultValues: createDataOrderProducts;
  user: string;
  url: string;
  isDisabled: boolean;
  ref?: React.RefObject<HTMLDivElement | null> | null;
}) => {
  const DATA_USER = {
    barTTN: {
      key: "order-ttn-bar",
      default: defaultValues?.ttnBar,
    },
    cucinaTTN: {
      key: "order-ttn-cucina",
      default: defaultValues?.ttnCucina,
    },
    barZN: {
      key: "order-bar",
      default: defaultValues?.bar,
    },
    cucinaZN: {
      key: "order-cucina",
      default: defaultValues?.cucina,
    },
  };
  const URL_TELEGRAM = {
    ttn: "/api/send-telegram-ttn",
    zn: "/api/send-telegram-zn",
  };
  type UserKey = keyof typeof DATA_USER;

  const STORAGE_KEY = DATA_USER[user as UserKey]?.key;

  const defaultData = DATA_USER[user as UserKey]?.default ?? {};
  const defaultValuesByKey = Object.fromEntries(
    Object.values(defaultData)
      .flat()
      .map((field) => [field, ""]),
  );

  const { sendTelegramMessage } = useSendTelegram();

  const form = useForm<typeof defaultValuesByKey>({
    defaultValues: defaultValuesByKey,
  });

  const { isLoaded } = useLocalStorageForm(form, STORAGE_KEY);

  const onSubmit: SubmitHandler<typeof defaultValuesByKey> = async (data) => {
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
      ref={ref}
      sendTelegram={url === "zn" ? true : false}
      url={url}
      defaultValues={defaultValuesByKey}
    >
      {children}
    </FormInput>
  );
};
