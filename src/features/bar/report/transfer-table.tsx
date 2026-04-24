"use client";
import NumericInput from "@/components/input-controlled/numeric-input";
import SelectField from "@/components/input-controlled/select-field";
import SelectFieldWithSearch from "@/components/input-controlled/select-with-search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderProducts } from "@/providers/order-products-provider";
import { formatNow } from "@/utils/format-date";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { WAREHOUSES } from "./constants";
import { ProductTransferSchemaType } from "./schema";

export default function TableProductsTransfer({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const { control, setValue } = useFormContext();

  const orderProducts = useOrderProducts();

  const PRODUCTS = orderProducts
    ? Array.from(
        new Set(
          Object.values(orderProducts).flatMap((category) =>
            Object.values(category).flat(),
          ),
        ),
      )
    : [];
  const reset = (idx: number) => {
    setValue(
      `report.productTransfer.${idx}`,
      {
        name: "",
        destination: "",
        quantity: "",
        time: "",
      },
      { shouldDirty: true, shouldTouch: true },
    );
  };
  const fieldsValues = useWatch({
    name: "report.productTransfer",
    control,
  }) as ProductTransferSchemaType[];

  useEffect(() => {
    fieldsValues?.forEach((item, idx) => {
      if (item?.quantity && item?.destination && item?.name && !item?.time) {
        setValue(`report.productTransfer.${idx}.time`, formatNow(), {
          shouldDirty: true,
        });
      }
    });
  }, [fieldsValues]);

  const { fields } = useFieldArray({ control, name: "report.productTransfer" });

  return (
    <Table className="md:table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="text-bl w-28 font-bold"> Transfer</TableHead>
          <TableHead className="w-18" />
          <TableHead className="w-10" />
          <TableHead className="w-10"></TableHead>
          <TableHead className="w-6"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields?.map((item, idx) => (
          <TableRow key={item.id}>
            <TableCell>
              <SelectFieldWithSearch
                data={PRODUCTS}
                fieldName={`report.productTransfer.${idx}.name`}
                className="h-8 w-full border-0 text-center text-sm! shadow-none"
                disabled={disabled}
                placeHolder="...."
              />
            </TableCell>
            <TableCell>
              <SelectField
                fieldName={`report.productTransfer.${idx}.destination`}
                data={WAREHOUSES}
                className="h-7! w-full border-0 text-center text-xs font-medium! shadow-none"
                disabled={disabled}
                placeHolder="...."
              />
            </TableCell>
            <TableCell>
              <NumericInput
                fieldName={`report.productTransfer.${idx}.quantity`}
                className="w-8 text-center"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="text-rd text-xs">
              {fieldsValues?.[idx]?.time}
            </TableCell>
            <TableCell
              onClick={() => !disabled && reset(idx)}
              className="cursor-pointer"
            >
              {fieldsValues?.[idx]?.name && (
                <Trash2Icon className="text-rd h-4 w-4" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
