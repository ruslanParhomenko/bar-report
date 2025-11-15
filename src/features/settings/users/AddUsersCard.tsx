import TextInput from "@/components/inputs/TextInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { Plus } from "lucide-react";
import { defaultUser } from "./schema";
import SelectInput from "@/components/inputs/SelectInput";
import { useAbility } from "@/providers/AbilityProvider";

const ROLES = ["ADMIN", "BAR", "CUCINA", "USER", "MNGR", "CASH"].map(
  (role) => ({
    label: role,
    value: role,
  })
);

export default function AddUsersCard() {
  const { isAdmin } = useAbility();
  const disabled = !isAdmin;
  const t = useTranslations("Home");
  const form = useFormContext();
  const { id } = form.getValues();
  return (
    <Card className="h-[88vh] flex flex-col overflow-hidden">
      <CardContent className="flex-1 pt-4 overflow-y-auto">
        <TextInput
          fieldName="mail"
          fieldLabel={t("mail")}
          type="mail"
          className="w-full h-8"
        />
        <SelectInput
          data={ROLES}
          fieldName="role"
          fieldLabel={t("role")}
          className="truncate w-full h-8"
        />
      </CardContent>
      <CardFooter className="flex flex-row justify-between py-8">
        <Button
          className="cursor-pointer"
          type="button"
          variant={"secondary"}
          onClick={() => form.reset(defaultUser)}
        >
          {t("reset")}
        </Button>

        <Button type="submit" disabled={disabled}>
          {id ? (
            t("update")
          ) : (
            <>
              <Plus className="inline mr-1" /> {t("add")}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
