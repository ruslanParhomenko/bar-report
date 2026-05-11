import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Switch } from "../ui/switch";

type SwitchInputProps = {
  fieldName: string;
  fieldLabel?: string;
  className?: string;
} & (
  | { checked?: never; onCheckedChange?: never } // RHF mode
  | { checked: boolean; onCheckedChange: (v: boolean) => void } // controlled mode
);

export default function SwitchInput({
  fieldName,
  fieldLabel,
  className,
  checked,
  onCheckedChange,
}: SwitchInputProps) {
  const { control } = useFormContext();

  if (checked !== undefined && onCheckedChange !== undefined) {
    return (
      <FormItem
        className={cn("mt-4 flex w-40 items-center justify-between", className)}
      >
        <FormControl>
          <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </FormControl>
        {fieldLabel && (
          <FormLabel className={cn(checked && "text-bl font-bold")}>
            {fieldLabel}
          </FormLabel>
        )}
      </FormItem>
    );
  }

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem
          className={cn(
            "mt-4 flex w-40 items-center justify-between",
            className,
          )}
        >
          <FormControl>
            <Switch
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          {fieldLabel && (
            <FormLabel className={cn(field.value && "text-bl font-bold")}>
              {fieldLabel}
            </FormLabel>
          )}
        </FormItem>
      )}
    />
  );
}
