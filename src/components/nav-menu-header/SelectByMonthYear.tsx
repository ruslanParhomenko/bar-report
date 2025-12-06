import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS, YEAR } from "@/utils/getMonthDays";

const VALUE = {
  string: (month: string) => month,
  number: (month: string) => MONTHS[Number(month) - 1],
};
const SET_VALUE = {
  string: (value: string) => value,
  number: (value: string) =>
    (MONTHS.indexOf(value as string) + 1).toString().padStart(2, "0"),
};

export default function SelectByMonthYear({
  month,
  setMonth,
  year,
  setYear,
  isLoading,
  typeMonth,
}: {
  month: string;
  setMonth: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  isLoading?: boolean;
  typeMonth?: "string" | "number";
}) {
  const classNameSelect =
    "w-26 h-7! p-1 bg-gr/60 border-0  [&>svg]:hidden justify-center";
  return (
    <div className="flex justify-center items-center md:gap-4 gap-1">
      <Select
        value={VALUE[typeMonth || "string"](month)}
        onValueChange={(value) =>
          setMonth(SET_VALUE[typeMonth || "string"](value))
        }
        disabled={isLoading}
      >
        <SelectTrigger className={classNameSelect}>
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
        <SelectTrigger className={classNameSelect}>
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
