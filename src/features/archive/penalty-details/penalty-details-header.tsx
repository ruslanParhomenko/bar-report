import SelectOptions from "@/components/select/select-options";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PenaltyDetailsHeader({
  options,
  value,
  setValue,
}: {
  options: string[];
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <TableHeader className="sticky top-0 bg-background z-40">
      <TableRow className="[&>th]:text-muted-foreground [&>th]:py-0">
        <TableHead className="w-1/8" />
        <TableHead className="w-1/8">
          <SelectOptions options={options} value={value} setValue={setValue} />
        </TableHead>
        <TableHead className="text-center w-1/8">day</TableHead>
        <TableHead className="text-center w-1/8">night</TableHead>
        <TableHead className="w-3/8">reason</TableHead>
        <TableHead className="text-center w-1/8">bonus</TableHead>
        <TableHead className="text-center w-1/8">penalty</TableHead>
        <TableHead className="text-center w-1/8" />
      </TableRow>
    </TableHeader>
  );
}
