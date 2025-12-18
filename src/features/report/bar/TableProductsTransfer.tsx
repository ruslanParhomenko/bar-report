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
import { useAbility } from "@/providers/AbilityProvider";
import SelectField from "@/components/inputs/SelectField";
import { useFormContext } from "react-hook-form";
import NumericInput from "@/components/inputs/NumericInput";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { formatNow } from "@/utils/formatNow";

export default function TableProductsTransfer() {
  const { isObserver, isUser } = useAbility();
  const isDisabled = isObserver || isUser;
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
  ) as ProductTransferSchemaType;

  useEffect(() => {
    const subscription = form.watch((_, { name: changedName }) => {
      if (
        changedName?.startsWith("productTransfer.") &&
        changedName.endsWith(".name")
      ) {
        const idx = Number(changedName.split(".")[1]);

        const nameValue = form.getValues(`productTransfer.${idx}.name`);

        if (nameValue) {
          form.setValue(`productTransfer.${idx}.time`, formatNow());
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

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
          <TableHead className="md:w-10">time</TableHead>
          <TableHead className="md:w-10">action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fieldsValues?.map((_, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <SelectFieldWithSearch
                data={PRODUCTS}
                fieldName={`productTransfer.${idx}.name`}
                disabled={isDisabled}
                className="h-8 w-full text-center"
              />
            </TableCell>
            <TableCell>
              <SelectField
                fieldName={`productTransfer.${idx}.destination`}
                data={WAREHOUSES}
                disabled={isDisabled}
                className="w-full text-center h-8! p-2"
              />
            </TableCell>
            <TableCell className="flex items-center justify-center">
              <NumericInput
                fieldName={`productTransfer.${idx}.quantity`}
                disabled={isDisabled}
                className="w-10 text-center h-8!"
              />
            </TableCell>
            <TableCell className="text-xs text-rd">
              {form.watch(`productTransfer.${idx}.time`)}
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
