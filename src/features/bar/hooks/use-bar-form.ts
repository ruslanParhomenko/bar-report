import {
  BarForm,
  barPageDefault,
  barPageSchema,
} from "@/features/bar/model/schema";
import { createBreakList } from "@/features/break/actions/create-break";
import { BreakForm, breakListDefault } from "@/features/break/model/schema";
import { createPenalty } from "@/features/penalty/actions/create-penalty";
import { remarksDefault } from "@/features/penalty/model/schema";
import { createReportBar } from "@/features/report-bar/actions/create-bar-report";
import {
  cashVerifyDefault,
  expensesDefault,
  inventoryDefault,
  productTransferDefault,
} from "@/features/report-bar/model/schema";
import { createTipsAdd } from "@/features/tips-add/actions/create-tips-add";
import { MONTHS } from "@/utils/get-month-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export function useBarForm({
  dataBreakList,
  currencyUSD,
}: {
  dataBreakList: BreakForm | null;
  currencyUSD: number | null;
}) {
  const form = useForm<BarForm>({
    defaultValues: {
      ...barPageDefault,
      breakForm: breakListDefault(dataBreakList?.rows ?? []),
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
        expenses: report.expenses?.filter((item) => item.name),
        productTransfer: report.productTransfer?.filter((item) => item.name),
        inventory: report.inventory?.filter((item) => item.quantity),
        notes: report.notes,
      },
    };

    await createTipsAdd({ day, month, year, tipsAdd, currency });
    await createReportBar(formateReportData);
    await createBreakList({ day, month, year, rows: breakForm.rows });
    await createPenalty({ day, month, year, remarks: penalty });

    const updatedTobacco = report.tobacco?.map((item) => {
      const finalStock =
        item.stock + Number(item.incoming || 0) - Number(item.outgoing || 0);

      return {
        ...item,
        stock: finalStock,
        incoming: "",
        outgoing: "",
      };
    });

    const updatedData = {
      tobacco: updatedTobacco,
      cashVerify: cashVerifyDefault,
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
