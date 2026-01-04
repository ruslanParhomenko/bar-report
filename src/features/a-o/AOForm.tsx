"use client";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { getMonthDays } from "@/utils/getMonthDays";

import { SubmitHandler, useForm } from "react-hook-form";
import { AOHeaderTable } from "./AOHeaderTable";
import { Table } from "@/components/ui/table";
import { AOFormType, aoSchema, defaultAOForm } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAbility } from "@/providers/AbilityProvider";
import { useEffect } from "react";
import { SendResetButton } from "@/components/buttons/SendResetButton";
import {
  AOContextValue,
  AOData,
  createAO,
  updateAO,
} from "@/app/actions/a-o/ao-action";
import { toast } from "sonner";
import RenderRow from "./RenderRow";
import { rowsAdvance, rowsPurchaseModa, rowsPurchaseNMB } from "./constants";

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
  const { isAdmin, isCash } = useAbility();
  const isDisabled = !isAdmin && !isCash;

  const form = useForm<AOFormType>({
    resolver: yupResolver(aoSchema),
    defaultValues: defaultAOForm,
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
    if (dataAo) return;

    const makeArray = () => Array(monthDays.length).fill("");

    const newRowCashData = {
      advanceModaByDay: makeArray(),
      advanceNBMByDay: makeArray(),

      purchaseModaByDay: makeArray(),
      ttnModaByDay: makeArray(),
      nameTtnModaByDay: makeArray(),

      fuelNBMByDay: makeArray(),
      purchaseNBMByDay: makeArray(),
      ttnNBMByDay: makeArray(),
      nameTtnNBMByDay: makeArray(),

      purchaseBarByDay: makeArray(),
      ttnBarByDay: makeArray(),
      nameTtnBarByDay: makeArray(),
    };

    form.setValue("rowAOData", newRowCashData);
  }, [dataAo]);
  useEffect(() => {
    if (!dataAo) return;

    form.reset({
      ...dataAo,
    });
  }, [dataAo, month, year, form]);

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col h-[90vh] w-full"
    >
      <Table>
        <AOHeaderTable month={month} monthDays={monthDays} />
        <RenderRow
          nameLabel="+"
          arrayRows={rowsAdvance}
          form={form}
          monthDays={monthDays}
          isDisabled={isDisabled}
        />

        <RenderRow
          nameLabel="- moda"
          arrayRows={rowsPurchaseModa}
          form={form}
          monthDays={monthDays}
          isDisabled={isDisabled}
        />

        <RenderRow
          nameLabel="- nbm"
          arrayRows={rowsPurchaseNMB}
          form={form}
          monthDays={monthDays}
          isDisabled={isDisabled}
        />
      </Table>
      {isAdmin && <SendResetButton />}
    </FormWrapper>
  );
}
