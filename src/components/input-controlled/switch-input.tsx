import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Switch } from "../ui/switch";

export default function SwitchInput({
  fieldName,
  fieldLabel,
  className,
}: {
  fieldName: string;
  fieldLabel?: string;
  className?: string;
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem
          className={cn(
            "mt-4 flex w-full items-center justify-between",
            className,
          )}
        >
          {fieldLabel && <FormLabel>{fieldLabel}</FormLabel>}
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
