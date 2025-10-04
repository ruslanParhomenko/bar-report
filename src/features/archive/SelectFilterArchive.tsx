"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";

export default function SelectFilterArchive({
  dataSelect,
  data,
  setFilteredData,
  nameTag,
}: {
  dataSelect: { label: string; value: string }[];
  data: any[];
  setFilteredData: (data: any[]) => void;
  nameTag: string;
}) {
  const [selectedType, setSelectedType] = useState<string>(dataSelect[0].value);
  useEffect(() => {
    const filtered =
      selectedType === "all"
        ? data
        : nameTag === "remarks"
        ? data.map((item) => ({
            date: item.date,
            remarks: item?.remarks?.filter(
              (remark: any) => remark.name === selectedType
            ),
          }))
        : nameTag === "breakList"
        ? data.map((item) => ({
            date: item.date,
            rows: item?.rows?.filter((row: any) => row.name === selectedType),
          }))
        : data.map((item) => ({
            date: item.date,
            [selectedType]: item[selectedType],
          }));
    setFilteredData(filtered);
  }, [selectedType]);
  return (
    <div className="flex justify-between items-center gap-2">
      <Label className="text-sm mt-2 text-rd px-5">filter by:</Label>
      <Select
        value={selectedType}
        onValueChange={(value) => setSelectedType(value)}
      >
        <SelectTrigger className="w-40 ">
          <SelectValue placeholder="Выберите тип" />
        </SelectTrigger>
        <SelectContent>
          {dataSelect.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
