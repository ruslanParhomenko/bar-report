import { useTranslations } from "next-intl";

export default function EmptyPage({ name }: { name: string }) {
  const t = useTranslations("Home");
  return (
    <div className="flex items-center justify-center w-screen h-[80vh] text-rd font-bold">
      {t("select")} {t(name)}
    </div>
  );
}
