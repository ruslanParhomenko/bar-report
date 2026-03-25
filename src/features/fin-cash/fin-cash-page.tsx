"use client";
import {
  defaultFinCashForm,
  FinCashForm,
  finCashSchema,
} from "@/features/fin-cash/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FormInput from "@/components/wrapper/form";
import { MONTHS } from "@/utils/get-month-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { FIN_CASH_ITEMS_LIST } from "./constants";
import TextInput from "@/components/inputs-form/text-input";
import { useEffect } from "react";
import {
  GetFinCashRowByYear,
  saveFinCashForm,
} from "@/app/actions/fin-cash/fin-cash-action";
import { toast } from "sonner";

export default function FinCashPage({
  finCashData,
  year,
}: {
  finCashData: GetFinCashRowByYear | null;
  year: string;
}) {
  const form = useForm<FinCashForm>({
    resolver: zodResolver(finCashSchema),
    defaultValues: defaultFinCashForm,
  });

  const value = form.watch("rowFinCashMonth");
  console.log(value);

  const submit: SubmitHandler<FinCashForm> = async (data) => {
    await saveFinCashForm({
      form_data: data,
      year: year,
    });
    toast.success("Форма сохранена успешно!");
  };

  useEffect(() => {
    if (finCashData) {
      form.reset(finCashData.form_data);
    } else {
      const newRowFinCash = Object.fromEntries(
        MONTHS.map((item) => [
          item,
          FIN_CASH_ITEMS_LIST.map((item) => ({ name: item, value: "" })),
        ]),
      );

      form.reset({
        ...defaultFinCashForm,
        rowFinCashMonth: newRowFinCash,
      });
    }
  }, [finCashData]);
  return (
    <FormInput form={form} onSubmit={submit} onError={(e) => console.log(e)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            {FIN_CASH_ITEMS_LIST.map((item) => (
              <TableHead key={item}>{item}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {MONTHS.map((month) => (
            <TableRow key={month}>
              <TableCell>{month}</TableCell>
              {FIN_CASH_ITEMS_LIST.map((itemName, index) => {
                const item = value?.[month]?.find((i) => i.name === itemName);
                return (
                  <TableCell key={itemName}>
                    <TextInput
                      fieldName={`rowFinCashMonth.${month}[${index}].value`}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FormInput>
  );
}
