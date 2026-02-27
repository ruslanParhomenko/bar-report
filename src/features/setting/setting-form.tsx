"use client";

import { useActionState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveDataProducts } from "@/app/actions/settings/settings-action";

type Props = {
  defaultValue: string;
};

export default function SettingsForm({ defaultValue }: Props) {
  const [state, formAction, isPending] = useActionState(saveDataProducts, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Products Settings</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          <Textarea
            name="json"
            defaultValue={defaultValue}
            className="min-h-[300px] font-mono text-sm"
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Save"}
          </Button>

          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}

          {state?.success && (
            <p className="text-sm text-green-500">Saved successfully</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
