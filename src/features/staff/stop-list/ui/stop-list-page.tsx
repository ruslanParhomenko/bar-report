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

import { useEdit } from "@/providers/edit-provider";
import { defaultStopList, StopListSchemaType } from "../model/schema";

import FormWrapper from "@/components/wrapper/form-wrapper";
import { DataOrderProducts } from "@/features/settings/setting/model/type";
import { useStopListForm } from "../hooks/use-stop-list-form";

export default function StopListPage({
  data,
  orderProducts,
}: {
  data: StopListSchemaType | null;
  orderProducts: DataOrderProducts | null;
}) {
  const { isEdit } = useEdit();

  const { form, stopListFieldArray, onSubmit, canEdit } = useStopListForm(data);

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
                {isEdit ? (
                  <SelectFieldWithSearch
                    data={PRODUCTS ?? []}
                    fieldName={`stopList.${idx}.product`}
                    disabled={!canEdit}
                    className="h-9"
                  />
                ) : (
                  item.product && (
                    <div className="text-rd h-9 pl-2 text-start font-bold">
                      {item.product}
                    </div>
                  )
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
              {isEdit && (
                <TableCell className="flex justify-center">
                  <AddRemoveFieldsButton
                    formField={stopListFieldArray}
                    defaultValues={defaultStopList}
                    index={idx}
                    disabled={!canEdit}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FormWrapper>
  );
}
