"use client";
import { useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useRef, useState } from "react";
import SelectArchiveById from "@/components/buttons/SelectArchiveById";
import SelectFilterArchive from "./SelectFilterArchive";
import {
  BreakListData,
  RemarkData,
  ReportBarData,
  ReportCucinaData,
} from "@/constants/type";
import { formatSelectData, handleScrollTop } from "./helpers";

type ApiDataMap = {
  breakList: BreakListData[];
  report: ReportBarData[];
  "report-cucina": ReportCucinaData[];
  remarks: RemarkData[];
};

export const ArchiveListTable = <T extends keyof ApiDataMap>({
  children,
  nameTag,
  data,
  options,
}: {
  children: (data: ApiDataMap[T]) => React.ReactNode;
  nameTag: T;
  data: any[];
  options: { label: string; value: string }[];
}) => {
  const t = useTranslations("Home");
  const accordionRef = useRef<HTMLDivElement>(null);

  const [filteredData, setFilteredData] = useState<any[]>(data);
  const id = useWatch({ name: `selectDataId_${nameTag}` });

  useEffect(() => {
    const selectedData =
      id === "all"
        ? data
        : data.find((item: any) => item.id === Number(id))
        ? [data.find((item: any) => item.id === Number(id))]
        : [];
    setFilteredData(selectedData);
  }, [id, data]);

  return (
    <Accordion type="single" collapsible className="py-2">
      <div ref={accordionRef}>
        <AccordionItem value={nameTag}>
          <AccordionTrigger
            onClick={() => {
              handleScrollTop({ accordionRef });
            }}
            className="text-base bg-bl cursor-pointer w-full px-4 py-2 hover:no-underline hover:text-amber-50"
          >
            {t(nameTag as string)}
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex flex-col md:flex-row md:justify-start gap-4 md:items-center mb-4">
              <SelectArchiveById
                dataSelect={formatSelectData(data)}
                nameTag={nameTag}
              />

              <SelectFilterArchive
                dataSelect={options}
                data={data}
                setFilteredData={setFilteredData}
                nameTag={nameTag}
              />
            </div>
            <div className="max-h-[80vh] overflow-y-auto">
              {children(filteredData)}
            </div>
          </AccordionContent>
        </AccordionItem>
      </div>
    </Accordion>
  );
};
