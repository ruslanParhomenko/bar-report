import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("Meniu");
  return (
    <header className="flex items-center justify-center pt-8 pb-4">
      <h1 className="flex items-center gap-2 text-center text-3xl font-bold  ">
        {t("menu")}
      </h1>
    </header>
  );
}
