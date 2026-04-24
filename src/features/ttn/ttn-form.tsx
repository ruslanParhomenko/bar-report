"use client";
import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import {
  createTTN,
  TTNGetDataType,
  updateTTN,
} from "@/app/actions/ttn/ttn-actions";
import { Form } from "@/components/ui/form";
import { Table } from "@/components/ui/table";
import { useAbility } from "@/providers/ability-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SuppliersFormType, suppliersSchema } from "./schema";
import TTNBodyTable from "./ttn-body-table";
import TTNFooterTable from "./ttn-footer-table";
import TtnHeaderTable from "./ttn-header";

export default function TTNForm({
  dataTtn,
  dataTtnPrev,
  agentTTN,
}: {
  dataTtn: TTNGetDataType | null;
  dataTtnPrev: TTNGetDataType | null;
  agentTTN: CreateDataTTN["agent"];
}) {
  const { monthDays, month, year } = useMonthDays();

  const { isAdmin } = useAbility();
  const isDisabled = !isAdmin;

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const [isEdit, setIsEdit] = useState(false);
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

  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          ref={ref}
          data-screenshot-root="true"
          className="mt-4 h-[92vh] overflow-auto"
        >
          <Table className="table-auto">
            <TtnHeaderTable
              setItemSearch={setItemSearch}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              setIsEdit={setIsEdit}
              isEdit={isEdit}
              disabled={!isAdmin}
              ref={ref}
            />
            <TTNBodyTable
              arrayRows={[...agentTTN]}
              monthDays={monthDays}
              normalizedSearch={normalizedSearch}
            />
            <TTNFooterTable arrayRows={[...agentTTN]} monthDays={monthDays} />
          </Table>
        </div>
      </form>
    </Form>
  );
}
