"use client";

import { ACTION_ITEM_BY_ROUTE } from "@/components/home-layout/footer-bar/constants";
import {
  ARCHIVE_MAIN_ROUTE,
  CASH_MAIN_ROUTE,
  CHART_ARCHIVE_ROUTE,
  CHART_CASH_ROUTE,
  CHART_RESULT_ROUTE,
  CHART_SCHEDULE_ROUTE,
  CHART_TIPS_ROUTE,
  CREATE_EMPLOYEE_MAIN_ROUTE,
  CREATE_USER_MAIN_ROUTE,
  EMPLOYEES_MAIN_ROUTE,
  RESULT_MAIN_ROUTE,
  SCHEDULE_MAIN_ROUTE,
  TIPS_MAIN_ROUTE,
  USERS_MAIN_ROUTE,
} from "@/constants/route-tag";

import { useFormId } from "@/hooks/use-form-id";
import { cn } from "@/lib/utils";
import { useAbility } from "@/providers/ability-provider";
import { useEdit } from "@/providers/edit-provider";
import { FolderPlus, Menu, SaveAllIcon, SendIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, ViewTransition } from "react";
import ChartButton from "../../buttons/chart-button";
import EditButton from "../../buttons/edit-button";
import ExitButton from "../../buttons/exit-button";
import PrintButton from "../../buttons/print-button";
import ResetButton from "../../buttons/reset-button";
import SaveButton from "../../buttons/save-button";
import SendScreenButton from "../../buttons/send-screen-button";
import { useSidebar } from "../../ui/sidebar";

const URL_CREATE_BY_TAB = {
  [EMPLOYEES_MAIN_ROUTE]: `/${CREATE_EMPLOYEE_MAIN_ROUTE}`,
  [USERS_MAIN_ROUTE]: `/${CREATE_USER_MAIN_ROUTE}`,
};

const CHART_URL_BY_TAB = {
  [SCHEDULE_MAIN_ROUTE]: `/${CHART_SCHEDULE_ROUTE}`,
  [TIPS_MAIN_ROUTE]: `/${CHART_TIPS_ROUTE}`,
  [ARCHIVE_MAIN_ROUTE]: `/${CHART_ARCHIVE_ROUTE}`,
  [RESULT_MAIN_ROUTE]: `/${CHART_RESULT_ROUTE}`,
  [CASH_MAIN_ROUTE]: `/${CHART_CASH_ROUTE}`,
};

export default function ActionBar() {
  const pathname = usePathname();
  const tab = useSearchParams().get("tab") || "";
  const mainRoute = pathname.split("/")[1] || "";

  const formId = useFormId();
  const { toggleSidebar } = useSidebar();

  const actions = (ACTION_ITEM_BY_ROUTE[
    mainRoute as keyof typeof ACTION_ITEM_BY_ROUTE
  ] ?? []) as readonly string[];

  const has = (key: string) => actions.includes(key);

  const { isAdmin } = useAbility();
  const { isEdit, setIsEdit, resetFn } = useEdit();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const iconCn = "bg-border rounded-md border px-3 py-1 cursor-pointer";
  const urlForCreate =
    URL_CREATE_BY_TAB[mainRoute as keyof typeof URL_CREATE_BY_TAB];

  return (
    <ViewTransition>
      <div className="bg-background z-10 flex items-center justify-around gap-4 pt-1 pb-4 md:justify-start md:gap-6 md:px-10">
        {has("edit") && (
          <EditButton
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            disabled={!isAdmin}
            className={iconCn}
          />
        )}
        {has("save") && (
          <SaveButton
            formId={formId}
            isEdit={isEdit}
            disabled={!isAdmin || isPending || !isEdit}
            className={iconCn}
          />
        )}
        {has("save-all") && (
          <button type="submit" className={iconCn} form={formId}>
            <SaveAllIcon size={18} strokeWidth={1.5} className="text-bl" />
          </button>
        )}
        {has("print") && <PrintButton className={iconCn} />}
        {has("mail") && tab && (
          <SendScreenButton patch={tab} className={iconCn} />
        )}
        {has("create") && (
          <button
            type="button"
            className={iconCn}
            onClick={() => startTransition(() => router.push(urlForCreate))}
            disabled={isPending || !isAdmin}
          >
            <FolderPlus size={20} strokeWidth={1.5} />
          </button>
        )}
        {has("exit") && <ExitButton className={iconCn} disabled={isPending} />}
        {has("send") && (
          <button type="submit" form={formId} className={iconCn}>
            <SendIcon size={18} strokeWidth={1.5} />
          </button>
        )}
        {has("reset") && (
          <ResetButton
            className={iconCn}
            reset={() => startTransition(() => resetFn?.())}
          />
        )}
        {has("chart") && (
          <ChartButton
            className={iconCn}
            url={CHART_URL_BY_TAB[mainRoute as keyof typeof CHART_URL_BY_TAB]}
          />
        )}
        <button
          className={cn("md:hidden", iconCn)}
          onClick={() => toggleSidebar()}
        >
          <Menu size={18} strokeWidth={1.5} className="text-bl" />
        </button>
      </div>
    </ViewTransition>
  );
}
