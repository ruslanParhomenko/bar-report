"use client";
import { deleteBreakList } from "@/app/actions/archive/breakListAction";
import { deleteReportBar } from "@/app/actions/archive/reportBarAction";
import { deleteReportCucina } from "@/app/actions/archive/reportCucinaAction";
import ModalConfirm from "@/components/modal/ModalConfirm";
import {
  BREAK_LIST_ENDPOINT,
  REPORT_BAR_ENDPOINT,
  REPORT_CUCINA_ENDPOINT,
} from "@/constants/endpoint-tag";
import { useAbility } from "@/providers/AbilityProvider";
import { formatDataForInput } from "@/utils/formatNow";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

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
  const { isAdmin } = useAbility();

  const [open, setOpen] = useState(false);

  const removeItem = () => {
    if (!nameTag) return;

    const action = actionByNameTag[nameTag as keyof typeof actionByNameTag];
    action(data.id.toString());
    setOpen(false);
  };

  return (
    <div className="flex w-full justify-between items-center px-4">
      <ModalConfirm
        open={open}
        setOpen={setOpen}
        handleConfirm={removeItem}
        message="delete"
      />
      <div className="text-md font-semibold text-bl">
        {formatDataForInput({ date: data.date })}
      </div>
      <div className="flex gap-4 items-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="cursor-pointer"
          disabled={!isAdmin}
        >
          <Trash2Icon className="w-4 h-4 text-rd" />
        </button>
      </div>
    </div>
  );
};
