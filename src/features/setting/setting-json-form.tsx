"use client";

import { saveSettingsData } from "@/app/actions/settings/settings-action";
import { Textarea } from "@/components/ui/textarea";
import { usePathname } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";

type Props = {
  defaultValue: string;
  type: "products" | "breakList" | "orderProducts" | "ttn";
};

export default function SettingsJsonForm({ defaultValue, type }: Props) {
  const [state, formAction, isPending] = useActionState(saveSettingsData, {});

  const pathname = usePathname();
  const formId = pathname.split("/")[1] || "";

  if (state?.success && !isPending) {
    toast.success("Success");
  } else if (state?.error) {
    toast.error(state.error);
  }

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        const formData = new FormData(e.currentTarget);

        console.log("json:", formData.get("json"));
        console.log("type:", formData.get("type"));
      }}
      className="space-y-4"
      id={formId}
    >
      <input type="hidden" name="type" value={type} />

      <Textarea
        name="json"
        defaultValue={defaultValue}
        className="mt-2 h-[90vh] font-mono text-sm"
      />
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
