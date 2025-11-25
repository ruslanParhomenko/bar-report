"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function FilterArchiveData({
  options,
  dateSelect,
  data,
  setFilteredData,
  nameTag,
}: {
  options: { label: string; value: string }[];
  dateSelect: { label: string; value: string }[];
  data: any[];
  setFilteredData: (data: any[]) => void;
  nameTag: string;
}) {
  const t = useTranslations("Home");
  const [selectedType, setSelectedType] = useState<string>(options?.[0].value);
  const [selectedDate, setSelectedDate] = useState<string>("all");
  useEffect(() => {
    const selectedData =
      selectedDate === "all"
        ? data
        : data.find((item: any) => item.id === Number(selectedDate))
        ? [data.find((item: any) => item.id === Number(selectedDate))]
        : [];
    const filtered =
      selectedType === "all"
        ? selectedData
        : nameTag === "remarks"
        ? selectedData.map((item) => ({
            date: item.date,
            remarks: item?.remarks?.filter(
              (remark: any) => remark.name === selectedType
            ),
          }))
        : nameTag === "breakList"
        ? selectedData.map((item) => ({
            date: item.date,
            rows: item?.rows?.filter((row: any) => row.name === selectedType),
          }))
        : selectedData.map((item) => ({
            date: item.date,
            [selectedType]: item[selectedType],
          }));
    setFilteredData(filtered);
  }, [selectedType, selectedDate, data]);
  return (
    <div className="flex flex-col md:flex-row md:justify-end gap-6 md:items-center mb-3 mr-4">
      <Select
        defaultValue="Выберите дату"
        value={selectedDate}
        onValueChange={(value) => setSelectedDate(value)}
      >
        <SelectTrigger className="w-full md:w-40 h-8!">
          <SelectValue placeholder="Выберите дату" />
        </SelectTrigger>
        <SelectContent>
          {dateSelect.map((item, index) => (
            <SelectItem key={index} value={item.label}>
              {item.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedDate == "all" && (
        <Select
          value={selectedType}
          onValueChange={(value) => setSelectedType(value)}
        >
          <SelectTrigger className="md:w-40 w-full h-8!">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options?.map((item, index) => (
              <SelectItem key={index} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {selectedDate && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="w-24 h-8"
            onClick={() => {
              setSelectedDate("");
              setSelectedType("all");
            }}
          >
            {t("reset")}
          </Button>
        </div>
      )}
    </div>
  );
}
