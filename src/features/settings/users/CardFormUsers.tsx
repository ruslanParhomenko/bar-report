import SelectField from "@/components/inputs/SelectField";
import TextInput from "@/components/inputs/TextInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { Plus } from "lucide-react";
import { defaultUser } from "./schema";

const ROLES = ["ADMIN", "BAR", "CUCINA", "USER", "MNGR", "CASH"];

export default function CardFormUsers({ disabled }: { disabled?: boolean }) {
  const t = useTranslations("Home");
  const form = useFormContext();
  const { id } = form.getValues();
  return (
    <Card className="shadow-md border rounded-2xl md:p-4">
      <CardContent>
        <Label className="text-base font-bold">{t("name")}</Label>

        <TextInput fieldName="mail" type="mail" className="w-full my-4 h-10" />
        <Label className="text-base font-bold">{t("role")}</Label>

        <SelectField
          data={ROLES}
          fieldName="role"
          className="truncate w-full my-4 h-10"
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
