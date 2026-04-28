"use client";

import { saveSettingsData } from "@/app/actions/settings/settings-action";
import { Textarea } from "@/components/ui/textarea";
import { usePathname } from "next/navigation";
import { useActionState } from "react";

type Props = {
  defaultValue: string;
  type: "products" | "breakList" | "orderProducts" | "ttn";
};

export default function SettingsJsonForm({ defaultValue, type }: Props) {
  const [_state, formAction, _isPending] = useActionState(saveSettingsData, {});

  const pathname = usePathname();
  const formId = pathname.split("/").pop() || "";

  return (
    <form action={formAction} className="space-y-4" id={formId}>
      <input type="hidden" name="type" value={type} />

      <Textarea
        name="json"
        defaultValue={defaultValue}
        className="mt-2 h-[90vh] font-mono text-sm"
      />
    </form>
  );
}
