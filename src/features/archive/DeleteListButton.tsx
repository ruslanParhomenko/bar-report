"use client";
import { deleteBreakList } from "@/app/actions/archive/breakListAction";
import { deleteReportBar } from "@/app/actions/archive/reportBarAction";
import { deleteReportCucina } from "@/app/actions/archive/reportCucinaAction";
import {
  BREAK_LIST_ENDPOINT,
  REPORT_BAR_ENDPOINT,
  REPORT_CUCINA_ENDPOINT,
} from "@/constants/endpoint-tag";
import { useAbility } from "@/providers/AbilityProvider";
import { formatDataForInput } from "@/utils/formatNow";
import { Pencil, Trash2Icon } from "lucide-react";
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
    <div className="flex w-full justify-between items-center px-4">
      <div className="text-md font-semibold text-bl">
        {formatDataForInput({ date: data.date })}
      </div>
      <div className="flex gap-4 items-center">
        <button
          onClick={() => editForm()}
          className="cursor-pointer"
          disabled={!isAdmin && !isManager}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => removeItem()}
          className="cursor-pointer"
          disabled={!isAdmin}
        >
          <Trash2Icon className="w-4 h-4 text-rd" />
        </button>
      </div>
    </div>
  );
};
