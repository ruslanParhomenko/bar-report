"use client";

import { ACTION_ITEM_BY_ROUTE } from "@/constants/footer-bar";
import {
  ARCHIVE_MAIN_ROUTE,
  CREATE_EMPLOYEE_MAIN_ROUTE,
  CREATE_USER_MAIN_ROUTE,
  EMPLOYEES_MAIN_ROUTE,
  PENALTY_UPDATE_MAIN_ROUTE,
} from "@/constants/route-tag";
import { useFormId } from "@/hooks/use-form-id";
import { useHashParam } from "@/hooks/use-hash";
import { cn } from "@/lib/utils";
import { useAbility } from "@/providers/ability-provider";
import { useEdit } from "@/providers/edit-provider";
import { FolderPlus, Menu, SaveAllIcon, SendIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition, ViewTransition } from "react";
import EditButton from "../buttons/edit-button";
import ExitButton from "../buttons/exit-button";
import PrintButton from "../buttons/print-button";
import ResetButton from "../buttons/reset-button";
import SaveButton from "../buttons/save-button";
import SendScreenButton from "../buttons/send-screen-button";
import { useSidebar } from "../ui/sidebar";

const URL_CREATE_BY_TAB = {
  [EMPLOYEES_MAIN_ROUTE]: `/${CREATE_EMPLOYEE_MAIN_ROUTE}`,
  users: `/${CREATE_USER_MAIN_ROUTE}`,
};

const URL_EXIT_BY_PATCH = {
  [EMPLOYEES_MAIN_ROUTE]: `/${EMPLOYEES_MAIN_ROUTE}`,
  users: `/${EMPLOYEES_MAIN_ROUTE}`,
  [PENALTY_UPDATE_MAIN_ROUTE]: `/${ARCHIVE_MAIN_ROUTE}`,
  [CREATE_EMPLOYEE_MAIN_ROUTE]: `/${EMPLOYEES_MAIN_ROUTE}`,
  [CREATE_USER_MAIN_ROUTE]: `/${EMPLOYEES_MAIN_ROUTE}`,
};

export default function ActionBar() {
  const pathname = usePathname();
  const mainRoute = pathname.split("/")[1] || "";

  const formId = useFormId();
  const { toggleSidebar } = useSidebar();

  const actions = (ACTION_ITEM_BY_ROUTE[
    mainRoute as keyof typeof ACTION_ITEM_BY_ROUTE
  ] ?? []) as readonly string[];

  const has = (key: string) => actions.includes(key);

  const { isAdmin } = useAbility();
  const { isEdit, setIsEdit, resetFn } = useEdit();
  const [tab] = useHashParam("tab");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const iconCn = "bg-border rounded-md border px-3 py-1 cursor-pointer";
  const urlForCreate =
    URL_CREATE_BY_TAB[tab as keyof typeof URL_CREATE_BY_TAB] || pathname;

  const urlForExit =
    URL_EXIT_BY_PATCH[mainRoute as keyof typeof URL_EXIT_BY_PATCH] || pathname;

  return (
    <ViewTransition>
      <div className="bg-background z-10 flex items-center justify-around gap-6 px-10 pt-1 pb-4 md:justify-start md:gap-6">
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
        {has("exit") && (
          <ExitButton
            className={iconCn}
            disabled={isPending}
            url={urlForExit}
          />
        )}
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
