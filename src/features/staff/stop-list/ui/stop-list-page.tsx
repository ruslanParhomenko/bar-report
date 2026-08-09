"use client";

import { AddRemoveFieldsButton } from "@/components/buttons/action-fields";
import SelectFieldWithSearch from "@/components/input-form/select-with-search";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAbility } from "@/providers/ability-provider";
import { useOrderProducts } from "@/providers/order-products-provider";
import { formatNowData } from "@/utils/format-date";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  defaultStopList,
  defaultStopListSchema,
  stopListSchema,
  StopListSchemaType,
} from "../model/schema";
import { useEdit } from "@/providers/edit-provider";

import FormWrapper from "@/components/wrapper/form-wrapper";
import { toast } from "sonner";
import { createStopList } from "../actions/create-stop-list";

export default function StopListPage({
  data,
}: {
  data: StopListSchemaType | null;
}) {
  const { isBar, isAdmin, isCucina } = useAbility();

  const { isEdit, setIsEdit } = useEdit();

  const canEdit = isBar || isAdmin || isCucina;

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


   

  const form = useForm<StopListSchemaType>({
    resolver: zodResolver(stopListSchema),
    defaultValues: defaultStopListSchema,
    mode: "onBlur",
  });
  const stopListFieldArray = useFieldArray({
    control: form.control,
    name: "stopList",
  });

  const watchStopList = useWatch({
    control: form.control,
    name: "stopList",
  });

  const onSubmit: SubmitHandler<StopListSchemaType> = async (data) => {
  if (!canEdit) {
    return toast.error("You do not have permission to edit the stop list.");
  }
    await createStopList( data);

    toast.success("Stop list saved successfully!");

    setIsEdit(false);
  };
  
  useEffect(() => {
    if (!data) return;
    form.reset(data);
  }, [data]);

  useEffect(() => {
    watchStopList?.forEach((item, idx) => {
      if (item?.product && !item.date) {
        const date = formatNowData();
        const author= isBar && "bar" || isCucina && "cucina" || isAdmin && "admin" || "";
        stopListFieldArray.update(idx, {
          ...stopListFieldArray.fields[idx],
          ...item,
          date,
          author: author,
        });
      }
    });
  }, [watchStopList]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit} className="md:p-4">
      <Table className="table-fixed md:w-200 [&_td]:text-center [&_th]:text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="w-32 md:w-90" />
            <TableHead className="w-16 md:w-50">date</TableHead>
              <TableHead className="w-16 md:w-50">editor</TableHead>
            {isEdit && (
              <TableHead className="w-12 text-left md:w-30">actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {stopListFieldArray.fields.map((item, idx) => (
            <TableRow key={item.id}>
              <TableCell>
                {isEdit ? <SelectFieldWithSearch
                  data={PRODUCTS ?? []}
                  fieldName={`stopList.${idx}.product`}
                  disabled={!canEdit}
                  className="h-9"
                />
              : item.product && (
                  <div className="text-rd h-9 text-start pl-2 font-bold">{item.product}</div>
                )}
              </TableCell>
              <TableCell className="text-center">
                {item.product && (
                  <div className="text-rd text-center">{item.date}</div>
                )}
              </TableCell>
                <TableCell className="text-center">
                {item.product && (
                  <div className="text-rd text-center">{item.author}</div>
                )}
              </TableCell>
                {isEdit && 
              <TableCell className="flex justify-center">
                
                <AddRemoveFieldsButton
                  formField={stopListFieldArray}
                  defaultValues={defaultStopList}
                  index={idx}
                  disabled={!canEdit}
                  />
                  </TableCell>
                  }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FormWrapper>
  );
}
