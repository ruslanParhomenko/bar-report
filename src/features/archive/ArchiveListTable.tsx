"use client";
import SelectInput from "@/components/inputs/SelectInput";
import { useWatch } from "react-hook-form";
import { DeleteListButton } from "../../components/buttons/DeleteListButton";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAbility } from "@/providers/AbilityProvider";
import { Label } from "@radix-ui/react-label";
import {
  BreakeList,
  DailyReport,
  DailyReportCucina,
  RemarkReport,
} from "@/generated/prisma";
import { ArchiveData, useArchive } from "@/hooks/useApiArchive";
import { useArchiveMutations } from "@/hooks/useApiActions";

type ApiDataMap = {
  breakList: BreakeList;
  report: DailyReport;
  "report-cucina": DailyReportCucina;
  remarks: RemarkReport;
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
  const { isObserver } = useAbility();
  const t = useTranslations("Home");
  const [dataSelect, setDataSelect] = useState<
    { label: string; value: string }[]
  >([]);

  const [openItem, setOpenItem] = useState<string | null>(null);
  const { data, invalidate } = useArchive();
  const { deleteMutation } = useArchiveMutations({
    endpoint: nameTag,
  });

  const dataKey = dataObjectApi[nameTag] as keyof ArchiveData;
  const arrayToFormat: Array<ApiDataMap[T]> =
    (data?.[dataKey] as Array<ApiDataMap[T]>) ?? [];
  const id = useWatch({ name: `selectDataId_${nameTag}` });
  const selected = arrayToFormat.find((item) => item.id === Number(id));

  const removeItem = () => {
    deleteMutation.mutate(Number(id));
    invalidate();
  };

  useEffect(() => {
    if (!data) return;
    const formattedData = arrayToFormat?.map((item) => {
      return {
        label: item.id.toLocaleString(),
        value: format(new Date(item.date), "dd.MM.yy"),
      };
    });
    setDataSelect(formattedData);
  }, [data, nameTag]);

  return (
    <Accordion
      type="single"
      collapsible
      className="py-2"
      value={openItem ?? ""}
      onValueChange={(val) => setOpenItem(val)}
    >
      <AccordionItem value={nameTag}>
        <AccordionTrigger className="text-lg bg-bl cursor-pointer w-full  [&>svg]:hidden px-4 py-2 hover:no-underline hover:text-amber-50">
          {t(nameTag as string)}
        </AccordionTrigger>

        <AccordionContent>
          <div className="md:w-1/4 w-full py-4" key={nameTag}>
            {isObserver ? (
              <Label className="text-muted-foreground">
                {t("insufficientRights")}
              </Label>
            ) : (
              <SelectInput
                fieldName={`selectDataId_${nameTag}`}
                data={dataSelect}
                placeHolder={t("chooseItem")}
              />
            )}
          </div>

          {data && id && selected && (
            <>
              <DeleteListButton
                data={{
                  ...selected,
                  date: format(new Date(selected.date), "dd.MM.yy"),
                }}
                deleteMutation={removeItem}
              />
              {children(selected)}
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
