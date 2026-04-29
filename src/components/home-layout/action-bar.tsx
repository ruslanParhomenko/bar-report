"use client";

import { useHashParam } from "@/hooks/use-hash";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAbility } from "@/providers/ability-provider";
import { useEdit } from "@/providers/edit-provider";
import { FolderPlus, RotateCcw, SaveAllIcon, SendIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition, ViewTransition } from "react";
import EditButton from "../buttons/edit-button";
import ExitButton from "../buttons/exit-button";
import MailButton from "../buttons/mail-button";
import PrintButton from "../buttons/print-button";
import SaveButton from "../buttons/save-button";

const ACTION_ITEM_BY_PATCH = {
  schedule: ["edit", "save", "print", "mail"],
  employees: ["print", "create", "exit"],
  algorithm: ["edit", "save", "print", "mail"],
  bar: ["save-all"],
  "report-cucina": ["save-all"],
  orders: ["send"],
  info: ["print"],
  archive: ["print"],
  tips: ["edit", "save", "print", "mail"],
  cash: ["edit", "save", "print", "mail"],
  "a-o": ["edit", "save", "print", "mail"],
  ttn: ["edit", "save", "print", "mail"],
  "fin-cash": ["edit", "save", "print"],
  result: ["print"],
  setting: ["save-all", "print"],

  "penalty-update": ["save", "print", "exit", "mail"],
  "create-employees": ["save", "print", "exit", "mail", "reset"],
  "create-users": ["save", "print", "exit", "mail", "reset"],
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
  const isMobile = useIsMobile();
  const router = useRouter();

  const iconCn = isMobile
    ? ""
    : "bg-border rounded-md border px-4 py-0.5 cursor-pointer";
  const urlForCreate =
    URL_CREATE_BY_TAB[tab as keyof typeof URL_CREATE_BY_TAB] || pathname;

  const urlForExit =
    URL_EXIT_BY_PATCH[formId as keyof typeof URL_EXIT_BY_PATCH] || pathname;

  return (
    <ViewTransition>
      <div className="bg-background z-100 flex items-center justify-center gap-1 py-1.5 md:justify-normal md:gap-6 md:px-4">
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
        {has("print") && <PrintButton className={iconCn} />}
        {has("mail") && tab && <MailButton patch={tab} className={iconCn} />}
        {has("save-all") && (
          <button type="submit" className={iconCn} form={formId}>
            <SaveAllIcon size={20} strokeWidth={1.5} className="text-bl" />
          </button>
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
            <SendIcon size={20} strokeWidth={1.5} />
          </button>
        )}
        {has("reset") && (
          <button type="button" className={iconCn} onClick={() => resetFn?.()}>
            <RotateCcw size={20} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </ViewTransition>
  );
}
