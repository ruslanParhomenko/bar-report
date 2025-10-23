"use client";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

import Schedule from "@/features/schedule/Schedule";
import { SelectDataRange } from "@/features/schedule/SelectDataRange";
import { Label } from "@/components/ui/label";

export default function SwitchSchedule() {
  const [oldSchedule, setNOldSchedule] = useState(false);
  return (
    <>
      <div className="flex items-center gap-4 py-2">
        <Label className="text-rd">old schedule</Label>
        <Switch
          checked={oldSchedule}
          onCheckedChange={setNOldSchedule}
          aria-label="old schedule"
        />
      </div>
      {oldSchedule ? <SelectDataRange /> : <Schedule />}
    </>
  );
}
