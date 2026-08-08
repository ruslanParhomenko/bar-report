"use client";
import {
  createProductsNbm,
  GetNbmProductsData,
} from "@/app/actions/ttn/ttn-nbm-products-action";
import { Table } from "@/components/ui/table";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { useOrderProducts } from "@/providers/order-products-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import BodyTable from "./body-table";
import HeaderTable from "./header-table";
import { ProductsFormNBM, productsSchemaNBM } from "./schema";

type FormData = ProductsFormNBM;
const schema = productsSchemaNBM;

export default function NbmProductsPage({
  data,
}: {
  data: GetNbmProductsData[] | null;
}) {
  const { monthDays, month, year } = useMonthDays();
  const orderProducts = Object.values(
    useOrderProducts()?.techTTN || {},
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
    if (dataByMont || !orderProducts?.length) return;

    const rows = Object.fromEntries(
      orderProducts.map((s) => [
        s,
        { arrival: Array(monthDays.length).fill(""), remain: "" },
      ]),
    );

    form.setValue("rowProducts", rows);
  }, [data, form, orderProducts, monthDays]);

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
          arrayRows={orderProducts}
          disabled={!isEdit}
          setSelectedDay={setSelectedDay}
        />
      </Table>
    </FormWrapper>
  );
}
