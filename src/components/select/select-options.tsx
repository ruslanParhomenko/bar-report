import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function SelectOptions({
  options,
  value,
  setValue,
  isLoading = false,
  className,
}: {
  options: string[];
  value: string;
  setValue: (value: string) => void;
  isLoading?: boolean;
  className?: string;
}) {
  return (
    <Select
      value={value}
      onValueChange={(value) => setValue(value)}
      disabled={isLoading}
    >
      <SelectTrigger
        className={cn(
          "shadow-none border-0 [&>svg]:hidden justify-center bg-background",
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((name, idx) => (
          <SelectItem key={`${name}-${idx}`} value={name}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
