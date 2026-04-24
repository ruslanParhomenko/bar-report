"use client";

import { saveSettingsData } from "@/app/actions/settings/settings-action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";

type Props = {
  defaultValue: string;
  type: "products" | "breakList" | "orderProducts" | "ttn";
};

export default function SettingsJsonForm({ defaultValue, type }: Props) {
  const [state, formAction, isPending] = useActionState(saveSettingsData, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="type" value={type} />

      <Textarea
        name="json"
        defaultValue={defaultValue}
        className="h-[88vh] font-mono text-sm"
      />

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      {state?.success && (
        <p className="text-sm text-green-500">Saved successfully</p>
      )}
    </form>
  );
}
