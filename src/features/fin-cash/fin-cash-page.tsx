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
  TableFooter,
} from "@/components/ui/table";
import FormInput from "@/components/wrapper/form";
import { MONTHS } from "@/utils/get-month-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { FIN_CASH_ITEMS_LIST } from "./constants";
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

  const values = form.watch("rowFinCashMonth");

  const getNumber = (val: any) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const getRowCalculations = (month: string) => {
    const row = values?.[month] || [];
    const map = Object.fromEntries(row.map((i: any) => [i.name, i.value]));

    const nds =
      getNumber(map["nbm-vat"]) +
      getNumber(map["bar-vat"]) -
      getNumber(map["ttn-vat"]);

    const tax =
      getNumber(map["225"]) +
      getNumber(map["534.2-12%"]) +
      getNumber(map["533.2-9%"]) +
      getNumber(map["533.1-24%"]);

    return { nds, tax };
  };

  const columnTotals = FIN_CASH_ITEMS_LIST.map((_, colIndex) => {
    return MONTHS.reduce((sum, month) => {
      const value = values?.[month]?.[colIndex]?.value;
      const num = parseFloat(value);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  });

  const ndsTotal = MONTHS.reduce(
    (sum, month) => sum + getRowCalculations(month).nds,
    0,
  );
  const taxTotal = MONTHS.reduce(
    (sum, month) => sum + getRowCalculations(month).tax,
    0,
  );

  const columnAverages = FIN_CASH_ITEMS_LIST.map((_, colIndex) => {
    let sum = 0;
    let count = 0;

    MONTHS.forEach((month) => {
      const value = values?.[month]?.[colIndex]?.value;
      if (value !== "" && value !== null && value !== undefined) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          sum += num;
          count++;
        }
      }
    });

    return count > 0 ? sum / count : 0;
  });

  const ndsAverage =
    MONTHS.reduce((sum, month) => {
      const val = getRowCalculations(month).nds;
      return val !== 0 ? sum + val : sum;
    }, 0) / MONTHS.length;

  const taxAverage =
    MONTHS.reduce((sum, month) => {
      const val = getRowCalculations(month).tax;
      return val !== 0 ? sum + val : sum;
    }, 0) / MONTHS.length;

  return (
    <FormInput form={form} onSubmit={submit}>
      <Table className="md:table-fixed">
        <TableHeader>
          <TableRow className="border-0!">
            <TableHead className="sticky left-0 bg-background" />

            <TableHead className="text-bl text-xs font-bold text-center">
              НДС
            </TableHead>
            <TableHead className="text-bl text-xs font-bold text-center">
              НАЛОГ
            </TableHead>

            {FIN_CASH_ITEMS_LIST.map((item) => (
              <TableHead
                key={item}
                className="text-bl text-xs font-bold text-center"
              >
                {item}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {MONTHS.map((month) => {
            const { nds, tax } = getRowCalculations(month);

            return (
              <TableRow key={month} className="[&>td]:p-0 border-0">
                <TableCell className="text-bl text-xs font-bold pl-4! sticky left-0 bg-background">
                  {month}
                </TableCell>

                <TableCell className="border border-muted-foreground/20 text-center text-xs font-bold">
                  {nds.toFixed(2)}
                </TableCell>
                <TableCell className="border border-muted-foreground/20 text-center text-xs font-bold">
                  {tax.toFixed(2)}
                </TableCell>

                {FIN_CASH_ITEMS_LIST.map((itemName, index) => (
                  <TableCell
                    key={itemName}
                    className="border border-muted-foreground/20"
                  >
                    <input
                      {...form.register(
                        `rowFinCashMonth.${month}[${index}].value`,
                      )}
                      className="h-8 p-0 m-0 text-center w-full cursor-pointer text-xs font-bold"
                    />
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow className="border-0 text-bl">
            <TableCell className="sticky left-0 bg-background font-bold text-xs pl-4!">
              Итого
            </TableCell>

            <TableCell className="border border-muted-foreground/20 text-center text-xs font-bold">
              {ndsTotal.toFixed(2)}
            </TableCell>
            <TableCell className="border border-muted-foreground/20 text-center text-xs font-bold">
              {taxTotal.toFixed(2)}
            </TableCell>

            {columnTotals.map((total, index) => (
              <TableCell
                key={index}
                className="text-center font-bold text-xs border"
              >
                {total.toFixed(2)}
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="border-0 text-muted-foreground">
            <TableCell className="sticky left-0 bg-background font-bold text-xs pl-4!">
              Среднее
            </TableCell>

            <TableCell className="border border-muted-foreground/20 text-center text-xs font-bold">
              {ndsAverage.toFixed(2)}
            </TableCell>
            <TableCell className="border border-muted-foreground/20 text-center text-xs font-bold">
              {taxAverage.toFixed(2)}
            </TableCell>

            {columnAverages.map((avg, index) => (
              <TableCell
                key={index}
                className="text-center font-bold text-xs border"
              >
                {avg.toFixed(2)}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </FormInput>
  );
}
