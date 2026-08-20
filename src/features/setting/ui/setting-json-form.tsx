"use client";

import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

type Props = {
  data: string;
  tag: string;
  type:
    | "products"
    | "breakList"
    | "orderProducts"
    | "ttn"
    | "priceList"
    | "menu"
    | "menuDaily"
    | "statusParameters";
};

export default function SettingsJson({ data, type, tag }: Props) {
  const [value, setValue] = useState(data);

  useEffect(() => {
    setValue(data);
  }, [type]);

  return (
    <>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="tag" value={tag} />

      <Textarea
        name="json"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-2 h-[88vh] border-0 font-mono text-sm shadow-none"
      />
    </>
  );
}
