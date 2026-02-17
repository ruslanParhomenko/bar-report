import { KeyboardEvent } from "react";

export function handleMultiTableNavigation(e: KeyboardEvent<HTMLInputElement>) {
  const key = e.key;
  const input = e.currentTarget;

  const td = input.closest("td");
  const tr = input.closest("tr");
  const tbody = input.closest("tbody");

  if (!td || !tr || !tbody) return;

  // TAB — переход между tbody (как было)
  if (key === "Tab") {
    e.preventDefault();

    const nextTbody = e.shiftKey
      ? (tbody.previousElementSibling as HTMLElement | null)
      : (tbody.nextElementSibling as HTMLElement | null);

    const target =
      nextTbody?.querySelector<HTMLInputElement>("input:not(:disabled)") ??
      null;

    target?.focus();
    return;
  }

  if (
    !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(key)
  ) {
    return;
  }

  e.preventDefault();

  const colIndex = td.cellIndex;

  let target: HTMLInputElement | null = null;

  // 🔹 Получаем все input внутри текущей ячейки
  const inputsInCell = td.querySelectorAll<HTMLInputElement>("input");
  const currentIndex = Array.from(inputsInCell).indexOf(input);

  switch (key) {
    case "ArrowRight":
    case "Enter":
      target =
        td.nextElementSibling?.querySelector<HTMLInputElement>(
          "input:not(:disabled)",
        ) ?? null;
      break;

    case "ArrowLeft":
      target =
        td.previousElementSibling?.querySelector<HTMLInputElement>(
          "input:not(:disabled)",
        ) ?? null;
      break;

    case "ArrowDown":
      // если есть второй input внутри ячейки — переключаемся внутри неё
      if (inputsInCell.length > 1 && currentIndex < inputsInCell.length - 1) {
        target = inputsInCell[currentIndex + 1];
        break;
      }

      // иначе переходим в следующую строку
      target =
        tr.nextElementSibling?.querySelector<HTMLInputElement>(
          `td:nth-child(${colIndex + 1}) input:not(:disabled)`,
        ) ?? null;
      break;

    case "ArrowUp":
      if (inputsInCell.length > 1 && currentIndex > 0) {
        target = inputsInCell[currentIndex - 1];
        break;
      }

      target =
        tr.previousElementSibling?.querySelector<HTMLInputElement>(
          `td:nth-child(${colIndex + 1}) input:not(:disabled)`,
        ) ?? null;
      break;
  }

  target?.focus();
}
