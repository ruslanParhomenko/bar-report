"use client";

import { useHashParam } from "@/hooks/use-hash";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAbility } from "@/providers/ability-provider";
import { useEdit } from "@/providers/edit-provider";
import { FolderPlus, SendIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition, ViewTransition } from "react";
import EditButton from "../buttons/edit-button";
import ExitButton from "../buttons/exit-button";
import MailButton from "../buttons/mail-button";
import PrintButton from "../buttons/print-button";
import SaveButton from "../buttons/save-button";
import { Button } from "../ui/button";

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
  settings: ["save-all", "print"],
} as const;

const URL_CREATE_BY_TAB = {
  employees: "/create-employees",
  users: "/create-users",
};

export default function ActionBar() {
  const pathname = usePathname();
  const formId = pathname.split("/").pop() || "";
  const actions = (ACTION_ITEM_BY_PATCH[
    formId as keyof typeof ACTION_ITEM_BY_PATCH
  ] ?? []) as readonly string[];

  const has = (key: string) => actions.includes(key);

  const { isAdmin } = useAbility();
  const { isEdit, setIsEdit } = useEdit();
  const [tab] = useHashParam("tab");
  const [isPending, startTransition] = useTransition();
  const isMobile = useIsMobile();
  const router = useRouter();

  const iconCn = isMobile ? "" : "bg-border rounded-md border px-2 py-1";
  const urlForCreate =
    URL_CREATE_BY_TAB[tab as keyof typeof URL_CREATE_BY_TAB] || pathname;

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
          <Button type="submit" className="bg-bl h-7 w-24 text-white">
            save
          </Button>
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
        {has("exit") && <ExitButton className={iconCn} disabled={isPending} />}
        {has("send") && (
          <button type="button" className={iconCn}>
            <SendIcon size={20} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </ViewTransition>
  );
}
