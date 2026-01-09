import { KeyboardEvent } from "react";

export function handleMultiTableNavigation(e: KeyboardEvent<HTMLInputElement>) {
  const key = e.key;
  const input = e.currentTarget;

  const td = input.closest("td");
  const tr = input.closest("tr");
  const tbody = input.closest("tbody");

  if (!td || !tr || !tbody) return;

  if (key === "Tab") {
    e.preventDefault();

    const nextTbody = e.shiftKey
      ? (tbody.previousElementSibling as HTMLElement | null)
      : (tbody.nextElementSibling as HTMLElement | null);

    const target = nextTbody?.querySelector<HTMLInputElement>(
      "input:not(:disabled)"
    );

    target?.focus();
    return;
  }

  if (
    !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(key)
  )
    return;

  e.preventDefault();

  const colIndex = td.cellIndex;

  let target: HTMLInputElement | null = null;

  switch (key) {
    case "ArrowRight":
    case "Enter":
      target = td.nextElementSibling?.querySelector("input") ?? null;
      break;

    case "ArrowLeft":
      target = td.previousElementSibling?.querySelector("input") ?? null;
      break;

    case "ArrowDown":
      target =
        tr.nextElementSibling?.querySelector(
          `td:nth-child(${colIndex + 1}) input`
        ) ?? null;
      break;

    case "ArrowUp":
      target =
        tr.previousElementSibling?.querySelector(
          `td:nth-child(${colIndex + 1}) input`
        ) ?? null;
      break;
  }

  target?.focus();
}
