"use client";

import { saveStopList } from "@/app/actions/stop-list/stop-list-action";
import { AddRemoveFieldsButton } from "@/components/buttons/action-fields";
import SelectFieldWithSearch from "@/components/input-controlled/select-with-search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FormInput from "@/components/wrapper/form";
import { useRealtimeSave } from "@/hooks/use-realtime-save";
import { useAbility } from "@/providers/ability-provider";
import { useOrderProducts } from "@/providers/order-products-provider";
import { formatNowData } from "@/utils/format-date";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  defaultStopList,
  defaultStopListSchema,
  stopListSchema,
  StopListSchemaType,
} from "./schema";

export default function StopListForm({
  data,
}: {
  data: StopListSchemaType | null;
}) {
  const { isBar } = useAbility();

  const orderProducts = useOrderProducts();

  const PRODUCTS =
    orderProducts && orderProducts
      ? Array.from(
          new Set(
            ["bar", "ttnBar"].flatMap((key) =>
              orderProducts?.[key as keyof typeof orderProducts]
                ? Object.values(
                    orderProducts[key as keyof typeof orderProducts],
                  ).flat()
                : [],
            ),
          ),
        )
      : [];

  // set form
  const form = useForm<StopListSchemaType>({
    resolver: zodResolver(stopListSchema),
    defaultValues: defaultStopListSchema,
  });
  const stopListFieldArray = useFieldArray({
    control: form.control,
    name: "stopList",
  });

  const watchStopList = useWatch({
    control: form.control,
    name: "stopList",
  });

  useRealtimeSave(watchStopList, isBar, async (stopList) => {
    if (!stopList) return;
    await saveStopList({ stopList });
    toast.info("сохранение данных…", { duration: 2000 });
  });

  // set form data on mount
  useEffect(() => {
    if (!data) return;
    form.reset(data);
  }, [data]);

  useEffect(() => {
    watchStopList?.forEach((item, idx) => {
      if (item?.product && !item.date) {
        const date = formatNowData();
        stopListFieldArray.update(idx, {
          ...stopListFieldArray.fields[idx],
          ...item,
          date,
        });
      }
    });
  }, [watchStopList]);

  return (
    <FormInput
      form={form}
      className="md:py-4"
      withButtons={false}
      onSubmit={() => {}}
    >
      <Table className="table-fixed md:w-200 [&_td]:text-center [&_th]:text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="w-32 md:w-90" />
            <TableHead className="w-16 md:w-50">date</TableHead>
            <TableHead className="w-12 text-left md:w-30">actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stopListFieldArray.fields.map((item, idx) => (
            <TableRow key={item.id}>
              <TableCell>
                <SelectFieldWithSearch
                  data={PRODUCTS ?? []}
                  fieldName={`stopList.${idx}.product`}
                  disabled={!isBar}
                  className="h-9"
                />
              </TableCell>
              <TableCell className="text-center">
                {item.product && (
                  <div className="text-rd text-center">{item.date}</div>
                )}
              </TableCell>
              <TableCell className="flex justify-center">
                <AddRemoveFieldsButton
                  formField={stopListFieldArray}
                  defaultValues={defaultStopList}
                  index={idx}
                  disabled={!isBar}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FormInput>
  );
}
