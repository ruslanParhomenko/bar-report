"use client";
import { useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { use, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  BreakeList,
  DailyReport,
  DailyReportCucina,
  RemarkReport,
  Row,
} from "@/generated/prisma";
import { ArchiveData, useArchive } from "@/hooks/useApiArchive";
import SelectArchiveById from "@/components/buttons/SelectArchiveById";
import SelectFilterArchive from "./SelectFilterArchive";
import { DATA_FILTER } from "./constant";
import { useEmployees } from "@/providers/GoogleSheetsProvider";

type ApiDataMap = {
  breakList: {
    rows: Row[];
    remarks: RemarkReport[];
    date: string;
    id: number;
  }[];
  report: DailyReport[];
  "report-cucina": DailyReportCucina[];
  remarks: RemarkReport[];
};

const dataObjectApi: Record<keyof ApiDataMap, keyof ArchiveData> = {
  breakList: "breakeList",
  report: "dailyReport",
  "report-cucina": "dailyReportCucina",
  remarks: "remarkReport",
};

export const ArhiveListTable = <T extends keyof ApiDataMap>({
  children,
  nameTag,
}: {
  children: (data: ApiDataMap[T], invalidate: () => void) => React.ReactNode;
  nameTag: T;
}) => {
  const { employees } = useEmployees();

  console.log("employees", employees);
  const [filteredData, setFilteredData] = React.useState<any[]>([]);
  const t = useTranslations("Home");
  const [dataSelect, setDataSelect] = useState<
    { label: string; value: string }[]
  >([]);

  const { data, invalidate } = useArchive();

  const id = useWatch({ name: `selectDataId_${nameTag}` });
  const dataKey = dataObjectApi[nameTag] as keyof ArchiveData;
  const arrayToFormat: ApiDataMap[T] = (data?.[dataKey] as ApiDataMap[T]) ?? [];
  const selectedData =
    id === "all"
      ? arrayToFormat
      : arrayToFormat.find((item: any) => item.id === Number(id))
      ? [arrayToFormat.find((item: any) => item.id === Number(id))]
      : [];

  useEffect(() => {
    if (!data) return;
    const formattedData = arrayToFormat?.map((item) => {
      return {
        label: item.id.toLocaleString(),
        value: format(new Date(item.date), "dd.MM.yy"),
      };
    });
    setDataSelect([{ label: "all", value: "all" }, ...formattedData]);
  }, [data, nameTag]);

  useEffect(() => {
    const selectedData =
      id === "all"
        ? arrayToFormat
        : arrayToFormat.find((item: any) => item.id === Number(id))
        ? [arrayToFormat.find((item: any) => item.id === Number(id))]
        : [];
    setFilteredData(selectedData);
  }, [id, data]);

  return (
    <Accordion type="single" collapsible className="py-2">
      <AccordionItem value={nameTag}>
        <AccordionTrigger className="text-base bg-bl cursor-pointer w-full  px-4 py-2 hover:no-underline hover:text-amber-50">
          {t(nameTag as string)}
        </AccordionTrigger>

        <AccordionContent>
          <div className="flex flex-col md:flex-row md:justify-start gap-4 md:items-center mb-4">
            <SelectArchiveById dataSelect={dataSelect} nameTag={nameTag} />
            {id === "all" && (
              <SelectFilterArchive
                dataSelect={DATA_FILTER[nameTag]}
                data={arrayToFormat}
                setFilteredData={setFilteredData}
              />
            )}
          </div>

          {children(
            filteredData ?? (selectedData as ApiDataMap[T]),
            invalidate
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
