import { Button } from "@/components/ui/button";
import { useArchiveMutations } from "@/hooks/useApiActions";
import { useAbility } from "@/providers/AbilityProvider";
import { format, isValid } from "date-fns";
import { useTranslations } from "next-intl";

export const DeleteListButton = ({
  data,
  nameTag,
}: {
  data: { id: number; date: string };
  nameTag: string;
}) => {
  console.log(data);
  const { isAdmin } = useAbility();
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
  };
  return (
    <div className="flex w-full justify-between items-center p-4 pt-4">
      <div className="text-lg font-semibold text-bl">{dataFormat}</div>
      <Button
        type="button"
        variant={"default"}
        onClick={() => removeItem()}
        disabled={!isAdmin}
        className="bg-bl hover:bg-rd"
      >
        {t("delete")}
      </Button>
    </div>
  );
};
