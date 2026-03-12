import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SelectFieldWithSearch from "@/components/inputs/select-with-search";
import SelectField from "@/components/inputs/select-input";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import NumericInput from "@/components/inputs/numeric-input";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { formatNow } from "@/utils/format-date";
import { ProductTransferSchemaType } from "./schema";
import { WAREHOUSES } from "./constants";
import { useOrderProducts } from "@/providers/order-products-provider";

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
          <TableHead className="w-24 font-bold text-bl"> Transfer</TableHead>
          <TableHead className="w-22" />
          <TableHead className="w-8" />
          <TableHead className="w-10"></TableHead>
          <TableHead className="w-8"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields?.map((item, idx) => (
          <TableRow key={item.id}>
            <TableCell className="py-1.5">
              <SelectFieldWithSearch
                data={PRODUCTS}
                fieldName={`report.productTransfer.${idx}.name`}
                className="h-6 w-full text-center text-sm! border-0 shadow-none"
                disabled={disabled}
                placeHolder="...."
              />
            </TableCell>
            <TableCell className="py-0">
              <SelectField
                fieldName={`report.productTransfer.${idx}.destination`}
                data={WAREHOUSES}
                className="w-full text-center h-7! text-xs border-0 shadow-none font-medium!"
                disabled={disabled}
                placeHolder="...."
              />
            </TableCell>
            <TableCell className="py-0">
              <NumericInput
                fieldName={`report.productTransfer.${idx}.quantity`}
                className="w-8 text-center h-7! text-sm!"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="text-xs text-rd py-0">
              {fieldsValues?.[idx]?.time}
            </TableCell>
            <TableCell
              onClick={() => !disabled && reset(idx)}
              className="cursor-pointer py-0"
            >
              {fieldsValues?.[idx]?.name && (
                <Trash2Icon className="w-4 h-4  text-rd" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
