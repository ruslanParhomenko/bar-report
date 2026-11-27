import { KeyboardEvent } from "react";

const SELECTOR = "input:not(:disabled)";

const getCellInputs = (row: HTMLTableRowElement | undefined, col: number) =>
  Array.from(
    row?.cells[col]?.querySelectorAll<HTMLInputElement>(SELECTOR) ?? [],
  );

const getRows = (table: HTMLTableElement) =>
  Array.from(table.querySelectorAll<HTMLTableRowElement>("tbody tr"));

export function handleMultiTableNavigation(e: KeyboardEvent<HTMLInputElement>) {
  const key = e.key;
  if (
    !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(key)
  )
    return;

  const input = e.currentTarget;
  const td = input.closest("td");
  const tr = input.closest("tr");
  const table = input.closest("table");
  if (!td || !tr || !table) return;

  e.preventDefault();

  const colIndex = td.cellIndex;
  const inputsInCell = getCellInputs(tr, colIndex);
  const currentIndex = inputsInCell.indexOf(input);

  const tables = Array.from(document.querySelectorAll("table"));
  const tableIndex = tables.indexOf(table);

  const rows = getRows(table);
  const rowIndex = rows.indexOf(tr);

  const getInput = (row?: HTMLTableRowElement) => {
    const inputs = getCellInputs(row, colIndex);
    return inputs[currentIndex] ?? inputs[0] ?? null;
  };

  let target: HTMLInputElement | null = null;

  switch (key) {
    case "ArrowRight":
    case "Enter":
      target =
        td.nextElementSibling?.querySelector<HTMLInputElement>(SELECTOR) ??
        null;
      break;

    case "ArrowLeft":
      target =
        td.previousElementSibling?.querySelector<HTMLInputElement>(SELECTOR) ??
        null;
      break;

    case "ArrowDown": {
      if (currentIndex < inputsInCell.length - 1) {
        target = inputsInCell[currentIndex + 1];
        break;
      }

      for (let r = rowIndex + 1; r < rows.length && !target; r++) {
        target = getInput(rows[r]);
      }

      for (let t = tableIndex + 1; t < tables.length && !target; t++) {
        for (const row of getRows(tables[t])) {
          target = getInput(row);
          if (target) break;
        }
      }
      break;
    }

    case "ArrowUp": {
      if (currentIndex > 0) {
        target = inputsInCell[currentIndex - 1];
        break;
      }

      for (let r = rowIndex - 1; r >= 0 && !target; r--) {
        target = getInput(rows[r]);
      }

      for (let t = tableIndex - 1; t >= 0 && !target; t--) {
        const prevRows = getRows(tables[t]);
        for (let r = prevRows.length - 1; r >= 0; r--) {
          const inputs = getCellInputs(prevRows[r], colIndex);
          if (inputs.length) {
            target = inputs[inputs.length - 1];
            break;
          }
        }
      }
      break;
    }
  }

  target?.focus();
}
