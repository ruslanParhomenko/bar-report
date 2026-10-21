"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cloneElement, type ReactElement, type ReactNode } from "react";

type AppTooltipProps = {
  content: ReactNode;
  children?: ReactNode;
  render?: ReactElement<{ children?: ReactNode }>;
};

export default function AppTooltip({
  content,
  children,
  render,
}: AppTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {render ? (
          cloneElement(render, undefined, children)
        ) : (
          <span>{children}</span>
        )}
      </TooltipTrigger>
      <TooltipContent className="z-100 w-fit">{content}</TooltipContent>
    </Tooltip>
  );
}
