"use client";
import { Button } from "@/components/ui/button";
import { useArchiveMutations } from "@/hooks/useApiActions";
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

export const DeleteListButton = <T extends BaseData>({
  data,
  nameTag,
  invalidate,
}: DeleteListButtonProps<T>) => {
  const router = useRouter();
  const { isAdmin, isMngr } = useAbility();
  const t = useTranslations("Home");

  const { deleteMutation } = useArchiveMutations({
    endpoint: nameTag,
  });

  const removeItem = () => {
    deleteMutation.mutate(Number(data.id));
    if (invalidate) {
      invalidate();
    }
  };
  const editForm = () => {
    router.push(`/breakList/remark/${data.id}`);
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
