"use client";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  ACVAMONT,
  ACVILIN,
  APIFERA,
  AQUATRADE,
  ARTACULINAR,
  BLUESHARK,
  BUCURIA,
  BUISNESS,
  CHOCO,
  COCACOLA,
  DAVIDAN,
  DELPHI,
  DINOVA,
  ETALONUS,
  FORWARD,
  FORWARD_CUCINE,
  FRUITBOX,
  FRUITBOX_C,
  GLOBARSPIRIT,
  IMCOMVIL,
  IUG,
  PRESTAPAC,
  ROGOB,
  UBFB,
  VERGNANO,
  VITAFOR,
  UBFB2,
} from "./constants";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import { useSession } from "next-auth/react";
import { format } from "date-fns";

import toast from "react-hot-toast";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useEffect, useMemo } from "react";
import { OrderListTTNFormValues } from "./schemas";
import { OrderListBarFormValues } from "../orderListBar/schemas";

export const OrderListTTNForm = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const nameOrder =
    pathname.split("/").pop()?.split("-")[1].toLocaleUpperCase() || "";
  const STORAGE_KEY = `order-form-${nameOrder}`;

  const t = useTranslations("UI");
  const session = useSession();

  const allFields = useMemo(
    () => [
      ...AQUATRADE,
      ...BUCURIA,
      ...COCACOLA,
      ...DAVIDAN,
      ...FORWARD,
      ...FRUITBOX,
      ...GLOBARSPIRIT,
      ...VERGNANO,
      ...CHOCO,
      ...APIFERA,
      ...ROGOB,
      ...BLUESHARK,
      ...FRUITBOX_C,
      ...DINOVA,
      ...IUG,
      ...PRESTAPAC,
      ...IMCOMVIL,
      ...ARTACULINAR,
      ...ETALONUS,
      ...VITAFOR,
      ...FORWARD_CUCINE,
      ...DELPHI,
      ...PRESTAPAC,
      ...IMCOMVIL,
      ...ETALONUS,
      ...UBFB,
      ...BUISNESS,
      ...ACVAMONT,
      ...ACVILIN,
      ...UBFB2,
    ],
    []
  );

  const defaultEmptyValues = Object.fromEntries(
    allFields.map((field) => [field, ""])
  ) as OrderListTTNFormValues;

  const localValues =
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

  const parsedLocalValues = localValues
    ? (JSON.parse(localValues) as OrderListTTNFormValues)
    : {};

  const form = useForm<OrderListTTNFormValues>({
    defaultValues: {
      ...defaultEmptyValues,
      ...parsedLocalValues,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, STORAGE_KEY]);

  const sendTextTelegram: SubmitHandler<OrderListBarFormValues> = async (
    data
  ) => {
    const userName = session?.data?.user?.name ?? "Неизвестный пользователь";
    const formattedDate = format(new Date(), "dd.MM.yyyy HH:mm");

    const filteredData = Object.fromEntries(
      Object.entries(data)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => [key, Number(value)])
    );

    const body = Object.entries(filteredData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    const message = `Заявка :${nameOrder}\n ${formattedDate}\n ${userName}\n\n${body}`;

    try {
      const res = await fetch("/api/send-telegram-ttn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });

      if (!res.ok) throw new Error("Failed to send");

      toast.success("Сообщение успешно отправлено!");
    } catch (e) {
      toast.error("Ошибка при отправке сообщения");
    }
  };

  // Сброс
  const resetForm = () => {
    form.reset(defaultEmptyValues);
    localStorage.removeItem(STORAGE_KEY);
    router.refresh();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(sendTextTelegram)}>
        {children}
        <div className="flex justify-start items-center p-5 pt-5 gap-4">
          <Button
            type="submit"
            variant={"default"}
            className="hover:bg-blue-600"
          >
            {t("send")}
          </Button>
          <Button
            type="button"
            variant={"secondary"}
            onClick={resetForm}
            className="hover:bg-red-600"
          >
            {t("reset")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
