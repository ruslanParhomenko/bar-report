"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PRODUCTS } from "../../bar/report/constants";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  defaultStopList,
  defaultStopListSchema,
  stopListSchema,
  StopListSchemaType,
} from "./schema";
import SelectFieldWithSearch from "@/components/inputs/SelectWithSearch";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAbility } from "@/providers/AbilityProvider";
import { formatNowData } from "@/utils/formatNow";
import { AddRemoveFieldsButton } from "@/components/buttons/AddRemoveFieldsButton";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/wrapper/form";
import { useRealtimeSave } from "@/hooks/use-realtime-save";
import { saveStopList } from "@/app/actions/stop-list/stopListAction";

export default function StopListForm({
  data,
}: {
  data: StopListSchemaType | null;
}) {
  const { isBar } = useAbility();

  // const DATA_PRODUCTS = {
  //   bar: PRODUCTS,
  //   cucina: [...new Set([...PRODUCTS_CUCINA])],
  // };

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
    if (!stopList || !form.formState.isDirty) return;
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
      <Table className="[&_th]:text-center [&_td]:text-center table-fixed md:w-200 ">
        <TableHeader>
          <TableRow>
            <TableHead className="md:w-90 w-32" />
            <TableHead className="md:w-50 w-16">date</TableHead>
            <TableHead className="text-left md:w-30 w-12">actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stopListFieldArray.fields.map((item, idx) => (
            <TableRow key={item.id}>
              <TableCell>
                <SelectFieldWithSearch
                  data={PRODUCTS}
                  fieldName={`stopList.${idx}.product`}
                  disabled={!isBar}
                  className="h-9"
                />
              </TableCell>
              <TableCell className="text-center">
                {item.product && (
                  <div className="text-center text-rd">{item.date}</div>
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
