"use client";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { Table } from "@/components/ui/table";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { getMonthDays } from "@/utils/getMonthDays";
import { SubmitHandler, useForm } from "react-hook-form";
import TTNBodyTable from "./ttn-body-table";
import { SuppliersFormType } from "./schema";
import { suppliers } from "./constants";

export default function TTNForm({
  dataTtn,
  monthDays,
  month,
  year,
}: {
  dataTtn: any | null;
  monthDays: ReturnType<typeof getMonthDays>;
  month: string;
  year: string;
}) {
  const form = useForm<SuppliersFormType>();
  const onSubmit: SubmitHandler<SuppliersFormType> = async (data) => {
    console.log(data);
  };
  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col h-[90vh] w-full"
    >
      <Table>
        <DayByMonthTable month={month} monthDays={monthDays} />
        <TTNBodyTable
          arrayRows={[...suppliers]}
          monthDays={monthDays}
          form={form}
        />
      </Table>
    </FormWrapper>
  );
}
