import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductTransferSchemaType } from "./schema";
import SelectFieldWithSearch from "@/components/inputs/SelectWithSearch";
import { PRODUCTS, WAREHOUSES } from "./constants";
import SelectField from "@/components/inputs/SelectField";
import { useFormContext } from "react-hook-form";
import NumericInput from "@/components/inputs/NumericInput";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { formatNow } from "@/utils/formatNow";

export default function TableProductsTransfer() {
  const form = useFormContext();

  const reset = (idx: number) => {
    form.setValue(
      `productTransfer.${idx}`,
      {
        name: "",
        destination: "",
        quantity: "",
        time: "",
      },
      { shouldDirty: true, shouldTouch: true }
    );
  };
  const fieldsValues = form.watch(
    "productTransfer"
  ) as ProductTransferSchemaType[];

  useEffect(() => {
    fieldsValues?.forEach((item, idx) => {
      if (item?.quantity && item?.destination && item?.name && !item?.time) {
        form.setValue(`productTransfer.${idx}.time`, formatNow(), {
          shouldDirty: true,
        });
      }
    });
  }, [fieldsValues, form]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-0! flex justify-start">
          <TableHead colSpan={3} className="h-6 font-bold text-bl">
            Transfer
          </TableHead>
        </TableRow>
        <TableRow>
          <TableHead className="md:w-46">product</TableHead>
          <TableHead className="md:w-26">destination</TableHead>
          <TableHead className="md:w-10">quantity</TableHead>
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
                fieldName={`productTransfer.${idx}.name`}
                className="h-8 w-full text-center"
              />
            </TableCell>
            <TableCell>
              <SelectField
                fieldName={`productTransfer.${idx}.destination`}
                data={WAREHOUSES}
                className="w-full text-center h-8! p-2"
              />
            </TableCell>
            <TableCell className="flex items-center justify-center">
              <NumericInput
                fieldName={`productTransfer.${idx}.quantity`}
                className="w-10 text-center h-8!"
              />
            </TableCell>
            <TableCell className="text-xs text-rd">
              {fieldsValues?.[idx]?.time}
            </TableCell>
            <TableCell onClick={() => reset(idx)} className="cursor-pointer">
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
