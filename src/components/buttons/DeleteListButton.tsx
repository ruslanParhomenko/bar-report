import { Button } from "@/components/ui/button";
import { useArchiveMutations } from "@/hooks/useApiActions";
import { useAbility } from "@/providers/AbilityProvider";
import { format, isValid } from "date-fns";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export const DeleteListButton = ({
  data,
  nameTag,
  invalidate,
}: {
  data: { id: number; date: string };
  nameTag: string;
  invalidate?: () => void;
}) => {
  const router = useRouter();
  const { isAdmin, isMngr } = useAbility();
  const t = useTranslations("Home");
  const dataFormat =
    data.date && isValid(new Date(data.date))
      ? format(new Date(data.date), "dd.MM.yy")
      : "-";

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
      <div className="text-lg font-semibold text-bl">{dataFormat}</div>
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
