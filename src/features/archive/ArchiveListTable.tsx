"use client";
import { useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  BreakeList,
  DailyReport,
  DailyReportCucina,
  RemarkReport,
} from "@/generated/prisma";
import { ArchiveData, useArchive } from "@/hooks/useApiArchive";
import SelectArchiveById from "@/components/buttons/SelectArchiveById";

type ApiDataMap = {
  breakList: BreakeList[];
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
  children: (data: ApiDataMap[T]) => React.ReactNode;
  nameTag: T;
}) => {
  const t = useTranslations("Home");
  const [dataSelect, setDataSelect] = useState<
    { label: string; value: string }[]
  >([]);

  const { data } = useArchive();

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

  return (
    <Accordion type="single" collapsible className="py-2">
      <AccordionItem value={nameTag}>
        <AccordionTrigger className="text-base bg-bl cursor-pointer w-full  px-4 py-2 hover:no-underline hover:text-amber-50">
          {t(nameTag as string)}
        </AccordionTrigger>

        <AccordionContent>
          <SelectArchiveById dataSelect={dataSelect} nameTag={nameTag} />

          {children(selectedData as ApiDataMap[T])}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
