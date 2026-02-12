import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SelectFieldWithSearch from "@/components/inputs/SelectWithSearch";
import SelectField from "@/components/inputs/SelectField";
import { useFormContext, useWatch } from "react-hook-form";
import NumericInput from "@/components/inputs/NumericInput";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { formatNow } from "@/utils/formatNow";
import { ProductTransferSchemaType } from "./schema";
import { PRODUCTS, WAREHOUSES } from "./constants";

export default function TableProductsTransfer({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const { control, setValue } = useFormContext();

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="md:w-46 font-bold text-bl"> Transfer</TableHead>
          <TableHead className="md:w-20" />
          <TableHead className="md:w-10" />
          <TableHead className="md:w-14"></TableHead>
          <TableHead className="md:w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fieldsValues?.map((_, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <SelectFieldWithSearch
                data={PRODUCTS}
                fieldName={`report.productTransfer.${idx}.name`}
                className="h-8 w-full text-center"
                disabled={disabled}
              />
            </TableCell>
            <TableCell>
              <SelectField
                fieldName={`report.productTransfer.${idx}.destination`}
                data={WAREHOUSES}
                className="w-full text-center h-8! p-2"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="flex items-center justify-center">
              <NumericInput
                fieldName={`report.productTransfer.${idx}.quantity`}
                className="w-10 text-center h-8!"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="text-xs text-rd">
              {fieldsValues?.[idx]?.time}
            </TableCell>
            <TableCell
              onClick={() => !disabled && reset(idx)}
              className="cursor-pointer"
            >
              {fieldsValues?.[idx]?.name && (
                <Trash2Icon className="w-4 h-4 mx-2 text-rd" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
