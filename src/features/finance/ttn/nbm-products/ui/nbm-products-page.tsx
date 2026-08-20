"use client";
import { Table } from "@/components/ui/table";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { DataOrderProducts } from "@/features/setting/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createProductsNbm } from "../actions/create-nbm-products";
import { ProductsFormNBM, productsSchemaNBM } from "../model/schema";
import { GetNbmProductsData } from "../model/type";
import BodyTable from "./body-table";
import HeaderTable from "./header-table";

type FormData = ProductsFormNBM;
const schema = productsSchemaNBM;

export default function NbmProductsPage({
  data,
  orderProducts,
}: {
  data: GetNbmProductsData[] | null;
  orderProducts: DataOrderProducts | null;
}) {
  const { monthDays, month, year } = useMonthDays();
  const orderProductsTechTtn = Object.values(
    orderProducts?.techTTN || {},
  ).flatMap((p) => p);

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const { isEdit, setIsEdit } = useEdit();

  const dataByMont = data?.find((ttn) => ttn.id === month);

  // form
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      rowProducts: {},
    },
  });

  // submit
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const formatData = {
      dataProducts: data,
      month,
      year,
    };
    try {
      await createProductsNbm(formatData);
      toast.success("NbmProducts успешно обновлён!");
    } catch (error) {
      toast.error("Ошибка при создании NbmProducts!");
    }

    setIsEdit(false);
  };

  useEffect(() => {
    if (dataByMont || !orderProductsTechTtn?.length) return;

    const rows = Object.fromEntries(
      orderProductsTechTtn.map((s) => [
        s,
        { arrival: Array(monthDays.length).fill(""), remain: "" },
      ]),
    );

    form.setValue("rowProducts", rows);
  }, [data, form, orderProductsTechTtn, monthDays]);

  useEffect(() => {
    if (!dataByMont) return;

    form.reset(dataByMont?.dataProducts);
  }, [dataByMont, form]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit} className="max-w-[90dvw] pl-2">
      <Table className="md:table-fixed">
        <HeaderTable
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
        <BodyTable
          arrayRows={orderProductsTechTtn}
          disabled={!isEdit}
          setSelectedDay={setSelectedDay}
        />
      </Table>
    </FormWrapper>
  );
}
