"use client";
import { deleteReportBar } from "@/app/actions/archive/reportBarAction";
import { Button } from "@/components/ui/button";
import {
  BREAK_LIST_ENDPOINT,
  REMARKS_ENDPOINT,
  REPORT_BAR_ENDPOINT,
  REPORT_CUCINA_ENDPOINT,
} from "@/constants/endpoint-tag";
import { useApi } from "@/hooks/useApi";
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
  invalidate?: () => void;
};

const actionByNameTag = {
  // [BREAK_LIST_ENDPOINT]: "breakList",
  [REPORT_BAR_ENDPOINT]: deleteReportBar,
  // [REPORT_CUCINA_ENDPOINT]: "dailyReportCucina",
  // [REMARKS_ENDPOINT]: "remarks",
};

export const DeleteListButton = <T extends BaseData>({
  data,
  nameTag,
  invalidate,
}: DeleteListButtonProps<T>) => {
  const router = useRouter();
  const { isAdmin, isMngr } = useAbility();
  const t = useTranslations("Home");

  const { deleteMutation } = useApi({
    endpoint: nameTag as string,
    queryKey: nameTag as string,
    fetchInit: false,
  });

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
          disabled={!isAdmin && !isMngr}
        >
          <Pencil />
        </Button>
        <Button
          type="button"
          variant={"destructive"}
          onClick={() => removeItem()}
          disabled={!isAdmin && !isMngr}
          className="bg-bl hover:bg-rd"
        >
          {t("delete")}
        </Button>
      </div>
    </div>
  );
};
