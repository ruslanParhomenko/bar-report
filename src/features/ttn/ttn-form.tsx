"use client";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { Table } from "@/components/ui/table";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { getMonthDays } from "@/utils/getMonthDays";
import { SubmitHandler, useForm } from "react-hook-form";
import TTNBodyTable from "./ttn-body-table";
import {
  SuppliersFormType,
  SuppliersFormTypeInput,
  suppliersSchema,
} from "./schema";
import { suppliers } from "./constants";
import { useAbility } from "@/providers/AbilityProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTTN,
  TTNGetDataType,
  updateTTN,
} from "@/app/actions/ttn/ttn-actions";
import { toast } from "sonner";
import { useEffect } from "react";
import TTNFooterTable from "./ttn-footer-table";

export default function TTNForm({
  dataTtn,
  month,
  year,
}: {
  dataTtn: TTNGetDataType | null;
  month: string;
  year: string;
}) {
  const monthDays = getMonthDays({ month, year });

  const { isAdmin } = useAbility();

  const form = useForm<SuppliersFormTypeInput>({
    resolver: zodResolver(suppliersSchema),
    defaultValues: suppliersSchema.parse(dataTtn ?? {}),
  });

  const onSubmit: SubmitHandler<SuppliersFormType> = async (data) => {
    const formatData = { ...data, month, year, unique_key: `${year}-${month}` };
    if (dataTtn?.id) {
      await updateTTN(dataTtn.id as string, formatData);
      toast.success("TTN успешно обновлён!");

      return;
    } else {
      await createTTN(formatData);
      toast.success("AO успешно создан!");

      return;
    }
  };

  useEffect(() => {
    if (dataTtn) return;

    const newRowTtnData = Object.fromEntries(
      suppliers.map((s) => [
        s,
        {
          start: "",
          minus: Array(monthDays.length).fill(""),
          plus: Array(monthDays.length).fill(""),
        },
      ])
    );

    form.setValue("rowSuppliers", newRowTtnData);
  }, [dataTtn, month, year, form]);
  useEffect(() => {
    if (!dataTtn) return;

    form.reset({
      ...dataTtn,
    });
  }, [dataTtn, month, year, form]);
  return (
    <FormWrapper form={form} onSubmit={onSubmit} withButtons={isAdmin}>
      <Table>
        <DayByMonthTable month={month} monthDays={monthDays} infoCell={true} />
        <TTNBodyTable
          arrayRows={[...suppliers]}
          monthDays={monthDays}
          form={form}
        />
        <TTNFooterTable
          arrayRows={[...suppliers]}
          monthDays={monthDays}
          form={form}
        />
      </Table>
    </FormWrapper>
  );
}
