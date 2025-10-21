// SkeletonTable.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  days: number;
}

export function SkeletonTable({ days }: Props) {
  return (
    <tbody>
      {Array(5)
        .fill(0)
        .map((_, idx) => (
          <tr key={idx}>
            <td className="p-2">
              <Skeleton className="h-6 w-6" />
            </td>
            <td className="p-2">
              <Skeleton className="h-6 w-24" />
            </td>
            {Array(days)
              .fill(0)
              .map((_, i) => (
                <td key={i} className="p-2">
                  <Skeleton className="h-6 w-8" />
                </td>
              ))}
            <td className="p-2">
              <Skeleton className="h-6 w-12" />
            </td>
          </tr>
        ))}
    </tbody>
  );
}
