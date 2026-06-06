"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { parseExp } from "./utils";

interface SaleItem {
  id: number;
  date: string;
  item: string;
  quantity: number;
  price: number;
  department: string;
  client: string;
}

export default function ParserPage() {
  const [result, setResult] = useState<SaleItem[]>([]);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const buffer = await file.arrayBuffer();

    const text = new TextDecoder("windows-1251").decode(buffer);

    const data = parseExp(text);

    setResult(data);
  };

  return (
    <div className="container py-10">
      <Card>
        <CardContent className="space-y-4 p-6">
          <Input type="file" accept=".exp" onChange={handleFile} />

          <Button
            onClick={() =>
              navigator.clipboard.writeText(JSON.stringify(result, null, 2))
            }
          >
            Copy JSON
          </Button>

          <pre className="max-h-175 overflow-auto rounded border p-4 text-xs">
            {JSON.stringify(result, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
