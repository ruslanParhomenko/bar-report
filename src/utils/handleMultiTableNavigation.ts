import { KeyboardEvent } from "react";

export function handleMultiTableNavigation(
  e: KeyboardEvent<HTMLInputElement>,
  row: number,
  col: number
) {
  const key = e.key;
  if (
    !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(key)
  )
    return;

  e.preventDefault();

  let nextRow = row;
  let nextCol = col;

  switch (key) {
    case "ArrowRight":
    case "Enter":
      nextCol++;
      break;
    case "ArrowLeft":
      nextCol--;
      break;
    case "ArrowDown":
      nextRow++;
      break;
    case "ArrowUp":
      nextRow--;
      break;
  }

  const nextInput = document.querySelector<HTMLInputElement>(
    `input[data-row="${nextRow}"][data-col="${nextCol}"]`
  );

  nextInput?.focus();
}
