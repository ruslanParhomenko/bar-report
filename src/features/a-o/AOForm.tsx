"use client";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { getMonthDays } from "@/utils/getMonthDays";

import { SubmitHandler, useForm } from "react-hook-form";
import { AOHeaderTable } from "./AOHeaderTable";
import { Table } from "@/components/ui/table";
import { AOFormType, aoSchema, defaultAOForm } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { AOBodyTable } from "./AOBodyTable";
import { useAbility } from "@/providers/AbilityProvider";
import { useEffect, useState } from "react";
import { SendResetButton } from "@/components/buttons/SendResetButton";
import {
  AOContextValue,
  AOData,
  createAO,
  updateAO,
} from "@/app/actions/a-o/ao-action";
import { toast } from "sonner";

export default function AOForm({
  dataAo,
  monthDays,
  month,
  year,
}: {
  dataAo: AOContextValue | null;
  monthDays: ReturnType<typeof getMonthDays>;
  month: string;
  year: string;
}) {
  console.log("AOForm render", dataAo);
  const { isAdmin, isCash } = useAbility();
  const isDisabled = !isAdmin && !isCash;

  const found = dataAo
    ? dataAo
    : {
        ...defaultAOForm,
        month: month as string,
        year: year as string,
      };

  const form = useForm<AOFormType>({
    resolver: yupResolver(aoSchema),
    defaultValues: found,
  });
  const onSubmit: SubmitHandler<AOFormType> = async (data) => {
    const formatData: AOData = {
      ...data,
      uniqueKey: `${year}-${month}`,
      month: month as string,
      year: year as string,
    };
    if (dataAo?.id) {
      await updateAO(dataAo.id as string, formatData);
      toast.success("AO успешно обновлён!");

      return;
    } else {
      await createAO(formatData);
      toast.success("AO успешно создан!");

      form.reset(defaultAOForm);
      return;
    }
  };
  useEffect(() => {
    if (!dataAo) return;

    form.reset({
      ...dataAo.rowAOData,
    } as AOFormType);
  }, [dataAo]);

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col h-[90vh] w-full"
    >
      <Table>
        <AOHeaderTable month={month} monthDays={monthDays} />
        <AOBodyTable
          form={form}
          monthDays={monthDays}
          isDisabled={isDisabled}
        />
      </Table>
      {isAdmin && <SendResetButton />}
    </FormWrapper>
  );
}
