"use client";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { Table } from "@/components/ui/table";
import { getMonthDays } from "@/utils/getMonthDays";
import { FieldErrors, Resolver, SubmitHandler, useForm } from "react-hook-form";
import TTNBodyTable from "./ttn-body-table";
import {
  defaultSuppliersForm,
  SuppliersFormType,
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
import FormInput from "@/components/wrapper/form";

export default function TTNForm({
  dataTtn,
  dataTtnPrev,
  month,
  year,
}: {
  dataTtn: TTNGetDataType | null;
  dataTtnPrev: TTNGetDataType | null;
  month: string;
  year: string;
}) {
  const monthDays = getMonthDays({ month, year });

  const { isAdmin } = useAbility();

  const form = useForm<SuppliersFormType>({
    resolver: zodResolver(suppliersSchema) as Resolver<SuppliersFormType>,
    defaultValues: dataTtn ? dataTtn : defaultSuppliersForm,
  });

  const onError = (errors: FieldErrors<SuppliersFormType>) => {
    toast.error(
      "Ошибка: проверьте числовые поля (допустимы только цифры и точка)",
    );
  };

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
          final: "",
          minus: Array(monthDays.length).fill(""),
          plus: Array(monthDays.length).fill(""),
        },
      ]),
    );

    form.setValue("rowSuppliers", newRowTtnData);
  }, [dataTtn, form]);
  useEffect(() => {
    if (!dataTtn) return;

    form.reset({
      ...dataTtn,
    });
  }, [dataTtn, form]);

  useEffect(() => {
    if (!dataTtnPrev) return;
    suppliers.map((s) => {
      form.setValue(
        `rowSuppliers.${s}.start`,
        dataTtnPrev.rowSuppliers[s].final,
      );
    });
  }, [dataTtnPrev, month, year, form]);
  return (
    <FormInput
      form={form}
      onSubmit={onSubmit}
      onError={onError}
      withButtons={isAdmin}
      withDate={false}
    >
      <Table>
        <DayByMonthTable month={month} monthDays={monthDays} infoCell={true} />
        <TTNBodyTable arrayRows={[...suppliers]} monthDays={monthDays} />
        <TTNFooterTable arrayRows={[...suppliers]} monthDays={monthDays} />
      </Table>
    </FormInput>
  );
}
