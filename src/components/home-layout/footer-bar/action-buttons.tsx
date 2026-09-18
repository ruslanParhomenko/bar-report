"use client";
import ChartButton from "@/components/buttons/chart-button";
import EditButton from "@/components/buttons/edit-button";
import ExitButton from "@/components/buttons/exit-button";
import PrintButton from "@/components/buttons/print-button";
import ResetButton from "@/components/buttons/reset-button";
import SaveButton from "@/components/buttons/save-button";
import SendScreenButton from "@/components/buttons/send-screen-button";
import { ACTION_ITEM_BY_ROUTE } from "@/components/home-layout/footer-bar/constants";
import {
  AO_REPORT_MAIN_ROUTE,
  ARCHIVE_MAIN_ROUTE,
  CASH_MAIN_ROUTE,
  CHART_AO_ROUTE,
  CHART_ARCHIVE_ROUTE,
  CHART_CASH_ROUTE,
  CHART_RESULT_ROUTE,
  CHART_SCHEDULE_ROUTE,
  CHART_TIPS_ROUTE,
  CHART_TTN_ROUTE,
  CREATE_EMPLOYEE_MAIN_ROUTE,
  CREATE_USER_MAIN_ROUTE,
  EMPLOYEES_MAIN_ROUTE,
  MENU_MAIN_ROUTE,
  RESULT_MAIN_ROUTE,
  SCHEDULE_MAIN_ROUTE,
  STOP_LIST_MAIN_ROUTE,
  TIPS_MAIN_ROUTE,
  TTN_MAIN_ROUTE,
  USERS_MAIN_ROUTE,
} from "@/constants/route-tag";
import { useFormId } from "@/hooks/use-form-id";
import { useEdit } from "@/providers/edit-provider";
import { FolderPlus, SaveAllIcon, SendIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

const URL_CREATE_BY_TAB = {
  [EMPLOYEES_MAIN_ROUTE]: `/${CREATE_EMPLOYEE_MAIN_ROUTE}`,
  [USERS_MAIN_ROUTE]: `/${CREATE_USER_MAIN_ROUTE}`,
};

const CHART_URL_BY_TAB = {
  [SCHEDULE_MAIN_ROUTE]: CHART_SCHEDULE_ROUTE,
  [TIPS_MAIN_ROUTE]: CHART_TIPS_ROUTE,
  [ARCHIVE_MAIN_ROUTE]: CHART_ARCHIVE_ROUTE,
  [RESULT_MAIN_ROUTE]: CHART_RESULT_ROUTE,
  [CASH_MAIN_ROUTE]: CHART_CASH_ROUTE,
  [TTN_MAIN_ROUTE]: CHART_TTN_ROUTE,
  [AO_REPORT_MAIN_ROUTE]: CHART_AO_ROUTE,
};

export default function ActionButtons({
  isAdmin,
  tab,
  size,
}: {
  isAdmin: boolean;
  tab: string;
  size?: number;
}) {
  const pathname = usePathname();
  const mainRoute = pathname.split("/")[1] || "";

  const formId = useFormId();

  const actions = (ACTION_ITEM_BY_ROUTE[
    mainRoute as keyof typeof ACTION_ITEM_BY_ROUTE
  ] ?? []) as readonly string[];

  const has = (key: string) => actions.includes(key);

  const { isEdit, setIsEdit, resetFn } = useEdit();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const iconCn = "bg-border rounded-md border px-3 py-1 cursor-pointer";
  const urlForCreate =
    URL_CREATE_BY_TAB[mainRoute as keyof typeof URL_CREATE_BY_TAB];

  const isCanEdit =
    isAdmin ||
    mainRoute === MENU_MAIN_ROUTE ||
    mainRoute === STOP_LIST_MAIN_ROUTE;
  return (
    <div className="bg-background z-9 order-2 flex items-center justify-around gap-3 py-1 md:order-1 md:justify-start md:gap-10 md:px-6 md:py-2">
      {has("edit") && (
        <EditButton
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          disabled={!isCanEdit || isPending}
          className={iconCn}
          size={size}
        />
      )}
      {has("save") && isEdit && (
        <SaveButton
          formId={formId}
          disabled={!isCanEdit || isPending || !isEdit}
          className={iconCn}
          size={size}
        />
      )}
      {has("save-all") && (
        <button type="submit" className={iconCn} form={formId}>
          <SaveAllIcon
            size={size ?? 18}
            strokeWidth={1.5}
            className="text-bl"
          />
        </button>
      )}
      {has("print") && <PrintButton className={iconCn} size={size} />}
      {has("mail") && tab && (
        <SendScreenButton patch={tab} className={iconCn} size={size} />
      )}
      {has("create") && (
        <button
          type="button"
          className={iconCn}
          onClick={() => startTransition(() => router.push(urlForCreate))}
          disabled={isPending || !isAdmin}
        >
          <FolderPlus size={size ?? 20} strokeWidth={1.5} />
        </button>
      )}
      {has("exit") && (
        <ExitButton className={iconCn} disabled={isPending} size={size} />
      )}
      {has("send") && (
        <button type="submit" form={formId} className={iconCn}>
          <SendIcon size={size ?? 18} strokeWidth={1.5} />
        </button>
      )}
      {has("reset") && (
        <ResetButton
          className={iconCn}
          reset={() => startTransition(() => resetFn?.())}
          size={size}
        />
      )}
      {has("chart") && (
        <ChartButton
          className={iconCn}
          url={CHART_URL_BY_TAB[mainRoute as keyof typeof CHART_URL_BY_TAB]}
          size={size}
        />
      )}
    </div>
  );
}
