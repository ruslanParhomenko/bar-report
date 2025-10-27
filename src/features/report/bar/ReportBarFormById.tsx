"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useEffect } from "react";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { toast } from "sonner";
import TableTobacco from "./TableTobacco";
import TableExpenses from "./TableExpenses";
import TableCashVerify from "./TableCashVerify";
import TableProductsTransfer from "./TableProductsTransfer";
import { Textarea } from "@/components/ui/textarea";
import TabelInventory from "./TabelInventory";

import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { ReportBarData } from "@/constants/type";
import { Button } from "@/components/ui/button";
import { updateReportBar } from "@/app/actions/archive/reportBarAction";

export default function ReportBarFormById({ data }: { data: ReportBarData }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  //form
  const form = useForm<ReportBarData>({
    defaultValues: {
      ...data,
    },
  });

  const handleSubmit: SubmitHandler<ReportBarData> = async (data) => {
    if (!id) return;
    await updateReportBar({ data });
    toast.success("Report updated successfully");
    router.back();
  };

  useEffect(() => {
    if (id && data) {
      form.reset(data);
    }
  }, [id, data]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="md:pl-2">
        <div className="flex items-center gap-4 justify-between ">
          <DatePickerInput fieldName="date" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[25%_70%] md:gap-15  pt-2">
          <TableTobacco />
          <div className="grid md:grid-cols-[65%_30%] gap-2">
            <div>
              <div className="grid  md:grid-cols-[40%_55%] md:gap-4 px-1 pb-2">
                <TableExpenses />
                <TableProductsTransfer />
              </div>
              <div className="px-4 py-4">
                <Textarea
                  placeholder="notes ..."
                  {...form.register("notes")}
                  className="resize-none"
                />
              </div>
            </div>
            <TabelInventory />
          </div>
        </div>

        <TableCashVerify />
        <div>
          <Button type="submit" className="mt-4">
            Save
          </Button>
          <Button
            type="button"
            variant={"destructive"}
            className="mt-4 ml-4"
            onClick={() => router.back()}
          >
            return
          </Button>
        </div>
      </form>
    </Form>
  );
}
