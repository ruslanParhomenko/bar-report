import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

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
            "flex items-center justify-between w-full mt-4",
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
