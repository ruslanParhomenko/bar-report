"use client";
import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import {
  createTTN,
  TTNGetDataType,
  updateTTN,
} from "@/app/actions/ttn/ttn-actions";
import { Form } from "@/components/ui/form";
import { useEdit } from "@/providers/edit-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SuppliersFormType, suppliersSchema } from "./schema";
import TtnBodyTable from "./ttn-body";
import TTNFooterTable from "./ttn-footer-table";
import TtnHeaderTable from "./ttn-header";

export default function TtnMonth({
  dataTtn,
  dataTtnPrev,
  agentTTN,
}: {
  dataTtn: TTNGetDataType | null;
  dataTtnPrev: TTNGetDataType | null;
  agentTTN: CreateDataTTN["agent"];
}) {
  const pathname = usePathname();
  const formId = pathname.split("/")[1] || "";

  const { monthDays, month, year } = useMonthDays();

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const { isEdit, setIsEdit } = useEdit();
  const [itemSearch, setItemSearch] = useState<string>("");
  const normalizedSearch = itemSearch.trim().toLowerCase();

  // form
  const form = useForm<SuppliersFormType>({
    resolver: zodResolver(suppliersSchema),
    defaultValues: {
      rowSuppliers: {},
    },
  });

  // submit
  const onSubmit: SubmitHandler<SuppliersFormType> = async (data) => {
    const formatData = { ...data, month, year, unique_key: `${year}-${month}` };
    if (dataTtn?.id) {
      await updateTTN(dataTtn.id, formatData);
      toast.success("TTN успешно обновлён!");
    } else {
      await createTTN(formatData);
      toast.success("TTN успешно создан!");
    }

    setIsEdit(false);
  };

  useEffect(() => {
    if (dataTtn || !agentTTN?.length) return;

    const rows = Object.fromEntries(
      agentTTN.map((s) => [
        s,
        {
          start: "",
          final: "",
          minus: Array(monthDays.length).fill(""),
          plus: Array(monthDays.length).fill(""),
        },
      ]),
    );

    form.setValue("rowSuppliers", rows);
  }, [dataTtn, form, agentTTN, monthDays]);
  useEffect(() => {
    if (!dataTtn) return;

    form.reset(dataTtn);
  }, [dataTtn, form]);

  useEffect(() => {
    if (!dataTtnPrev || !agentTTN?.length) return;
    agentTTN.forEach((agent) => {
      const value = dataTtnPrev.rowSuppliers?.[agent]?.final ?? "";

      form.setValue(`rowSuppliers.${agent}.start`, value);
    });
  }, [dataTtnPrev, month, year, form, agentTTN]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id={formId}
        className="w-[90vw]"
      >
        <table>
          <TtnHeaderTable
            setItemSearch={setItemSearch}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
          <TtnBodyTable
            arrayRows={[...agentTTN]}
            normalizedSearch={normalizedSearch}
            disabled={!isEdit}
          />
          <TTNFooterTable arrayRows={[...agentTTN]} monthDays={monthDays} />
        </table>
      </form>
    </Form>
  );
}
