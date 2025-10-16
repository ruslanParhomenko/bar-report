import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

export default function SelectFilter({
  data,
  value,
  setValue,
}: {
  data: any[];
  value: string;
  setValue: (value: string) => void;
}) {
  const t = useTranslations("Home");
  const { theme } = useTheme();

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger
        className={cn(
          "md:w-[200px] w-full",
          theme === "dark" ? "border-0" : ""
        )}
      >
        <SelectValue placeholder={t("select")} />
      </SelectTrigger>
      <SelectContent>
        {data.map((m) => (
          <SelectItem key={m.value} value={m.value}>
            {m.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
