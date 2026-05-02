"use client";

import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

type Props = {
  data: string;
  type: "products" | "breakList" | "orderProducts" | "ttn";
};

export default function SettingsJson({ data, type }: Props) {
  const [value, setValue] = useState(data);

  useEffect(() => {
    setValue(data);
  }, [type]);

  return (
    <>
      <input type="hidden" name="type" value={type} />

      <Textarea
        name="json"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-2 h-[85vh] border-0 font-mono text-sm shadow-none"
      />
    </>
  );
}
