// hooks/use-order-screenshot.ts
import html2canvas from "html2canvas-pro";

export async function createOrderScreenshot(
  filtered: Record<string, Record<string, string>>,
  tab: string,
): Promise<string> {
  const entries = Object.entries(filtered);
  const colSize = Math.ceil(entries.length / 3);
  const cols = [
    entries.slice(0, colSize),
    entries.slice(colSize, colSize * 2),
    entries.slice(colSize * 2),
  ];

  const printEl = document.createElement("div");
  printEl.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 794px;
    min-height: 1123px;
    background: white;
    padding: 20px;
    font-family: sans-serif;
    font-size: 12px;
    color: black;
  `;

  printEl.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
      ${cols
        .map(
          (col) => `
        <div>
          ${col
            .map(
              ([category, items]) => `
            <div style="margin-bottom:12px;">
              <div style="font-weight:bold; color:#1a6fb5; margin-bottom:4px; border-bottom:1px solid #eee; padding-bottom:2px;">
                ${category}
              </div>
              ${Object.entries(items as Record<string, string>)
                .map(
                  ([name, amount]) => `
                <div style="display:flex; justify-content:space-between; padding:2px 6px;">
                  <span>${name}</span>
                  <span style="font-weight:bold;">${amount}</span>
                </div>
              `,
                )
                .join("")}
            </div>
          `,
            )
            .join("")}
        </div>
      `,
        )
        .join("")}
    </div>
  `;

  document.body.appendChild(printEl);

  const canvas = await html2canvas(printEl, {
    scale: 2,
    height: printEl.scrollHeight,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  document.body.removeChild(printEl);

  return canvas.toDataURL("image/png");
}
