"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import SubmitButton from "@/components/buttons/submit-button";
import {
  defaultEmptyValuesBar,
  defaultEmptyValuesCucina,
  defaultValuesZNBar,
  defaultValuesZNCucina,
  OrderListFormType,
} from "@/features/orders/schemas";
import { useSendTelegram } from "@/hooks/use-send-telegram";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { FormWrapper } from "@/components/wrapper/form-wrapper";

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

  const form = useForm<OrderListFormType>({
    defaultValues: defaultValues,
  });
  const resetFormValues = () => {
    form.reset(defaultValues);
  };
  const { isLoaded } = useLocalStorageForm(form, STORAGE_KEY);

  const onSubmit: SubmitHandler<OrderListFormType> = async (data) => {
    sendTelegramMessage(
      data,
      URL_TELEGRAM[url as keyof typeof URL_TELEGRAM],
      user
    );
  };
  if (!isLoaded) return null;

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col min-h-[90vh]"
    >
      {children}
      <SubmitButton resetForm={resetFormValues} reset={true} />
    </FormWrapper>
  );
};
