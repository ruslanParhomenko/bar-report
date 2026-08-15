"use client";

import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SECTIONS } from "../../menu-daily/model/constants";
import { MenuDailyItem } from "../../menu-daily/model/schema";
import { createMenuWeek } from "../actions/create-menu-week";
import { DAYS, DAY_LABELS } from "../config/constants";
import {
  MenuWeekForm,
  menuWeekDefaultValues,
  menuWeekSchema,
} from "../model/schema";
import DayCard from "./day-card";

type Props = {
  listMenuDaily: Record<(typeof SECTIONS)[number], MenuDailyItem[]> | null;
  defaultValues: MenuWeekForm | null;
};

export default function MenuDailyWeek({ listMenuDaily, defaultValues }: Props) {
  const { isEdit, setIsEdit } = useEdit();

  const form = useForm<MenuWeekForm>({
    resolver: zodResolver(menuWeekSchema),
    defaultValues: defaultValues ?? menuWeekDefaultValues,
  });

  const onSubmit: SubmitHandler<MenuWeekForm> = async (formData) => {
    await createMenuWeek(formData);

    setIsEdit(false);
  };

  useEffect(() => {
    form.reset(defaultValues ?? menuWeekDefaultValues);
  }, [defaultValues]);

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center gap-6 py-1 md:flex-row md:flex-wrap print:mx-2 print:my-4 print:h-[90dvh] print:justify-around print:gap-1.5"
    >
      {DAYS.map((day) => (
        <DayCard
          key={day}
          dayKey={day}
          dayLabel={DAY_LABELS[day]}
          menuData={listMenuDaily ?? {}}
          isDisabled={!isEdit}
        />
      ))}
    </FormWrapper>
  );
}
