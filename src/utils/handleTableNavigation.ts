export const handleTableNavigation = (
  e: React.KeyboardEvent<HTMLInputElement>,
  rowIndex: number,
  colIndex: number
) => {
  const { key, currentTarget } = e;

  if (key === "Enter") {
    e.preventDefault();
    const val = currentTarget.value;
    currentTarget.setSelectionRange(val.length, val.length);
    return;
  }

  const cursorAtStart = currentTarget.selectionStart === 0;
  const cursorAtEnd = currentTarget.selectionEnd === currentTarget.value.length;
  const isSelecting =
    currentTarget.selectionStart !== currentTarget.selectionEnd;

  if (
    (key === "ArrowLeft" && !cursorAtStart) ||
    (key === "ArrowRight" && !cursorAtEnd) ||
    isSelecting
  ) {
    return;
  }

  let targetRow = rowIndex;
  let targetCol = colIndex;

  switch (key) {
    case "ArrowUp":
      targetRow = rowIndex - 1;
      break;
    case "ArrowDown":
      targetRow = rowIndex + 1;
      break;
    case "ArrowLeft":
      targetCol = colIndex - 1;
      break;
    case "ArrowRight":
      targetCol = colIndex + 1;
      break;
    default:
      return;
  }

  e.preventDefault();

  const selector = `input[data-row="${targetRow}"][data-col="${targetCol}"]`;
  const nextInput = document.querySelector<HTMLInputElement>(selector);

  if (nextInput) {
    nextInput.focus();
    const val = nextInput.value;
    nextInput.setSelectionRange(val.length, val.length);
  }
};
