"use client";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

import Schedule from "@/features/schedule/Schedule";
import { SelectDataRange } from "@/features/schedule/SelectDataRange";
import { Label } from "@/components/ui/label";

export default function SwitchSchedule() {
  const [newSchedule, setNewSchedule] = useState(false);
  return (
    <>
      <div className="flex items-center gap-4 py-2">
        <Label className="text-rd">set new schedule</Label>
        <Switch
          checked={newSchedule}
          onCheckedChange={setNewSchedule}
          aria-label="Sort by name"
        />
      </div>
      {newSchedule ? <Schedule /> : <SelectDataRange />}
    </>
  );
}
