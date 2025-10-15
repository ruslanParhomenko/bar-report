import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { productTransferDefault } from "./schema";
import SelectFieldWithSearch from "@/components/inputs/SelectWithSearch";
import { PRODUCTS, WAREHOUSES } from "./constants";
import { useAbility } from "@/providers/AbilityProvider";
import SelectField from "@/components/inputs/SelectField";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import NumericInput from "@/components/inputs/NumericInput";

export default function TableProductsTransfer() {
  const { isObserver, isUser } = useAbility();
  const isDisabled = isObserver || isUser;
  const form = useFormContext();

  const reset = (idx: number) => {
    const current = form.getValues("productTransfer");
    current[idx] = productTransferDefault[0];
    form.setValue("productTransfer", current);
  };
  const fieldsValues = form.watch("productTransfer");
  return (
    <div className="w-full">
      <Label className="text-lg font-semibold pb-4 text-bl">Transfer</Label>
      <Table className="w-full [&_th]:text-center [&_td]:text-center">
        <TableHeader>
          <TableRow>
            <TableHead>product</TableHead>
            <TableHead>quantity</TableHead>
            <TableHead>destination</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {new Array(7).fill(productTransferDefault)?.map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <SelectFieldWithSearch
                  data={PRODUCTS}
                  fieldName={`productTransfer.${idx}.name`}
                  disabled={isDisabled}
                  className="h-8 w-full text-center min-w-30!"
                />
              </TableCell>
              <TableCell className="flex items-center justify-center">
                <NumericInput
                  fieldName={`productTransfer.${idx}.quantity`}
                  disabled={isDisabled}
                  className="w-12! text-center h-8!"
                />
              </TableCell>
              <TableCell>
                <SelectField
                  fieldName={`productTransfer.${idx}.destination`}
                  data={WAREHOUSES}
                  disabled={isDisabled}
                  className="w-full text-center h-8!"
                />
              </TableCell>
              <TableCell>
                {fieldsValues?.[idx]?.name && (
                  <Button
                    variant={"destructive"}
                    className="h-8 cursor-pointer"
                    onClick={() => reset(idx)}
                  >
                    X
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
