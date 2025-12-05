import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS, YEAR } from "@/utils/getMonthDays";

export default function SelectScheduleByMonth({
  month,
  setMonth,
  year,
  setYear,
  isLoading,
}: {
  month: string;
  setMonth: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  isLoading?: boolean;
}) {
  return (
    <div className="flex items-center md:gap-2 gap-1">
      <Select
        value={month}
        onValueChange={(value) => setMonth(value)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-20 h-7! p-1 bg-border/30 border-0 text-muted-foreground [&>svg]:hidden justify-center">
          <SelectValue placeholder="month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={year}
        onValueChange={(value) => setYear(value)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-18 h-7! p-1 bg-border/30 border-0 [&>svg]:hidden justify-center text-muted-foreground">
          <SelectValue placeholder="year" />
        </SelectTrigger>
        <SelectContent>
          {YEAR.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
