"use client";
import { deleteBreakList } from "@/app/actions/archive/breakListAction";
import { deleteReportBar } from "@/app/actions/archive/reportBarAction";
import { deleteReportCucina } from "@/app/actions/archive/reportCucinaAction";
import { Button } from "@/components/ui/button";
import {
  BREAK_LIST_ENDPOINT,
  REPORT_BAR_ENDPOINT,
  REPORT_CUCINA_ENDPOINT,
} from "@/constants/endpoint-tag";
import { useAbility } from "@/providers/AbilityProvider";
import { formatDataForInput } from "@/utils/formatNow";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type BaseData = {
  id: number;
  date: Date;
};

type DeleteListButtonProps<T extends BaseData> = {
  data: T;
  nameTag: string;
};

const actionByNameTag = {
  [BREAK_LIST_ENDPOINT]: deleteBreakList,
  [REPORT_BAR_ENDPOINT]: deleteReportBar,
  [REPORT_CUCINA_ENDPOINT]: deleteReportCucina,
};

export const DeleteListButton = <T extends BaseData>({
  data,
  nameTag,
}: DeleteListButtonProps<T>) => {
  const router = useRouter();
  const { isAdmin, isManager } = useAbility();
  const t = useTranslations("Home");

  const removeItem = async () => {
    if (!nameTag) return;

    const action = actionByNameTag[nameTag as keyof typeof actionByNameTag];
    await action(data.id.toString());
  };
  const editForm = () => {
    router.push(`/${nameTag}/${data.id}`);
  };
  return (
    <div className="flex w-full justify-between items-center">
      <div className="text-lg font-semibold text-bl">
        {formatDataForInput({ date: data.date })}
      </div>
      <div className="flex gap-2 items-center">
        <Button
          onClick={() => editForm()}
          variant={"ghost"}
          className="cursor-pointer"
          disabled={!isAdmin && !isManager}
        >
          <Pencil />
        </Button>
        <Button
          type="button"
          variant={"destructive"}
          onClick={() => removeItem()}
          disabled={!isAdmin}
          className="bg-bl hover:bg-rd"
        >
          {t("delete")}
        </Button>
      </div>
    </div>
  );
};
