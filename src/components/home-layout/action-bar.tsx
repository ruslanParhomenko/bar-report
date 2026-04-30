"use client";

import { useHashParam } from "@/hooks/use-hash";
import { useAbility } from "@/providers/ability-provider";
import { useEdit } from "@/providers/edit-provider";
import { FolderPlus, SaveAllIcon, SendIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition, ViewTransition } from "react";
import EditButton from "../buttons/edit-button";
import ExitButton from "../buttons/exit-button";
import PrintButton from "../buttons/print-button";
import ResetButton from "../buttons/reset-button";
import SaveButton from "../buttons/save-button";
import SendScreenButton from "../buttons/send-screen-button";

const ACTION_ITEM_BY_PATCH = {
  schedule: ["edit", "save", "print", "mail"],
  employees: ["print", "create"],
  algorithm: ["edit", "save", "print"],
  bar: ["save-all", "print"],
  "report-cucina": ["save-all"],
  orders: ["send", "reset"],
  info: ["print"],
  archive: ["print"],
  tips: ["edit", "save", "print"],
  cash: ["edit", "save", "print"],
  "a-o": ["edit", "save", "print"],
  ttn: ["edit", "save", "print"],
  "fin-cash": ["edit", "save", "print"],
  result: ["print"],
  setting: ["save-all"],

  "penalty-update": ["save", "print", "exit", "mail"],
  "create-employees": ["save", "print", "exit", "reset"],
  "create-users": ["save", "print", "exit", "reset"],
} as const;

const URL_CREATE_BY_TAB = {
  employees: "/create-employees",
  users: "/create-users",
};

const URL_EXIT_BY_PATCH = {
  employees: "/employees",
  users: "/users",
  "penalty-update": "/archive#tab=penalty",
  "create-employees": "/employees",
  "create-users": "/employees",
};

export default function ActionBar() {
  const pathname = usePathname();
  const formId = pathname.split("/")[1] || "";

  const actions = (ACTION_ITEM_BY_PATCH[
    formId as keyof typeof ACTION_ITEM_BY_PATCH
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
    URL_EXIT_BY_PATCH[formId as keyof typeof URL_EXIT_BY_PATCH] || pathname;

  return (
    <ViewTransition>
      <div className="bg-background z-10 flex items-center justify-center gap-6 py-1 md:justify-normal md:gap-6 md:px-4">
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
      </div>
    </ViewTransition>
  );
}
