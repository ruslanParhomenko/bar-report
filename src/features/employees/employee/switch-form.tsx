import SwitchInput from "@/components/inputs/switch-input";
import { useTranslations } from "next-intl";

export default function SwitchForm() {
  const t = useTranslations("Home");
  return (
    <div>
      <SwitchInput
        fieldName="employeesWorkForm"
        fieldLabel={t("employeesWorkForm")}
      />
      <SwitchInput fieldName="employeesKey" fieldLabel={t("employeesKey")} />
    </div>
  );
}
