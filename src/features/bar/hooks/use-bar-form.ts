import {
  BarForm,
  barPageDefault,
  barPageSchema,
} from "@/features/bar/model/schema";
import { BreakForm, breakListDefault } from "@/features/break/model/schema";
import { remarksDefault } from "@/features/penalty/model/schema";
import {
  cashVerifyDefault,
  expensesDefault,
  productTransferDefault,
} from "@/features/report-bar/model/schema";
import { MONTHS } from "@/utils/get-month-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export function useBarForm({
  dataBreakList,
  dataReportBar,
  currencyUSD,
}: {
  dataBreakList: BreakForm | null;
  dataReportBar: Record<string, string[]> | null;
  currencyUSD: number | null;
}) {
  const tobaccoDefault = (dataReportBar?.tobacco ?? []).map((name) => ({
    name,
    stock: 0,
    incoming: "",
    outgoing: "",
    finalStock: 0,
  }));

  const inventoryDefault = (dataReportBar?.inventory ?? []).map((name) => ({
    name,
    quantity: "",
    time: "",
  }));

  const form = useForm<BarForm>({
    defaultValues: {
      ...barPageDefault,
      breakForm: breakListDefault(dataBreakList?.rows ?? []),
      report: {
        ...barPageDefault.report,
        tobacco: tobaccoDefault,
        inventory: inventoryDefault,
      },
    },
    resolver: zodResolver(barPageSchema),
  });

  const onSubmit: SubmitHandler<BarForm> = async (data) => {
    const { date, report, penalty, breakForm, tipsAdd } = data;

    const dateObj = new Date(date);
    const day = String(dateObj.getDate());
    const month = MONTHS[dateObj.getMonth()];
    const year = dateObj.getFullYear().toString();
    const currency = currencyUSD?.toFixed(2) ?? "18";

    const formateReportData = {
      day,
      month,
      year,
      report: {
        tobacco: report.tobacco?.map((item) => ({
          ...item,
          stock: item.stock,
          incoming: item.incoming ?? "0",
          outgoing: item.outgoing ?? "0",
          finalStock: item.stock + +item.incoming - +item.outgoing,
        })),
        cashVerify: report.cashVerify?.filter((item) => item.value),
        cashVerifyBuffet: report.cashVerifyBuffet?.filter((item) => item.value),
        expenses: report.expenses?.filter((item) => item.name),
        productTransfer: report.productTransfer?.filter((item) => item.name),
        inventory: report.inventory?.filter((item) => item.quantity),
        notes: report.notes,
      },
    };

    // await createTipsAdd({ day, month, year, tipsAdd, currency });
    // await createReportBar(formateReportData);
    // await createPenalty({ day, month, year, remarks: penalty });
    // if (breakForm?.rows?.length) {
    //   await createBreakList({ day, month, year, rows: breakForm?.rows });
    // }
    const updatedTobacco = report.tobacco?.map((item) => ({
      ...item,
      stock:
        item.stock + Number(item.incoming || 0) - Number(item.outgoing || 0),
      incoming: "",
      outgoing: "",
    }));
    const tobaccoNext = (dataReportBar?.tobacco ?? []).map((name) => {
      const prev = updatedTobacco?.find((t) => t.name === name);
      return {
        name,
        stock: prev?.stock ?? 0,
        incoming: "",
        outgoing: "",
        finalStock: 0,
      };
    });

    const updatedData = {
      tobacco: tobaccoNext,
      cashVerify: cashVerifyDefault,
      cashVerifyBuffet: cashVerifyDefault,
      expenses: expensesDefault,
      productTransfer: productTransferDefault,
      inventory: inventoryDefault,
      notes: "",
    };

    const resetState: BarForm = {
      date: new Date().toISOString(),
      report: updatedData,
      penalty: remarksDefault,
      breakForm: breakListDefault(dataBreakList?.rows ?? []),
      tipsAdd: [],
    };

    form.reset(resetState);

    toast.success("Бар отчет успешно сохранён !");
  };

  return {
    form,
    onSubmit,
  };
}
