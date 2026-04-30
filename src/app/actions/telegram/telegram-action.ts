"use server";

export async function sendToTelegram(formData: FormData, patch: string) {
  const ID_BY_PATCH = {
    cucina: process.env.TELEGRAM_CHAT_CUCINA,
    bar: process.env.TELEGRAM_CHAT_BAR,
    zn: process.env.TELEGRAM_CHAT_ID,
  };
  try {
    const file = formData.get("file") as File | null;
    const caption = formData.get("caption")?.toString() || "";

    if (!file) {
      return { error: "Missing file" };
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = ID_BY_PATCH[patch as keyof typeof ID_BY_PATCH];
    if (!token || !chatId) {
      return {
        error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_CUCINA",
      };
    }

    const tgForm = new FormData();
    tgForm.append("chat_id", chatId);
    tgForm.append("caption", caption);
    tgForm.append(
      "photo",
      new Blob([await file.arrayBuffer()], { type: file.type }),
      "screenshot.png",
    );

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendPhoto`,
      {
        method: "POST",
        body: tgForm,
      },
    );

    const data = await response.json();

    if (!data.ok) {
      return {
        error: "Failed to send Telegram message",
        details: data,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

const formatOrderText = (
  data: Record<string, Record<string, string>>,
): string => {
  return Object.entries(data)
    .map(([category, items]) => {
      const lines = Object.entries(items)
        .map(([name, amount]) => `  • ${name}: <b>${amount}</b>`)
        .join("\n");
      return `<b>${category}</b>\n${lines}`;
    })
    .join("\n\n");
};

const ID_BY_PATCH = {
  "bar-ttn": process.env.TELEGRAM_CHAT_MY_ID,
  "cucina-ttn": process.env.TELEGRAM_CHAT_MY_ID,
  "bar-zn": process.env.TELEGRAM_CHAT_ID,
  "cucina-zn": process.env.TELEGRAM_CHAT_ID,
};

const TEXT_PATCHES = ["bar-ttn", "cucina-ttn", "bar-zn"];

export async function sendTelegramMessage(
  data: Record<string, Record<string, string>>,
  patch: string,
) {
  if (!TEXT_PATCHES.includes(patch)) {
    throw new Error(`patch ${patch} does not support text sending`);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = ID_BY_PATCH[patch as keyof typeof ID_BY_PATCH];

  if (!token || !chatId) throw new Error("Missing Telegram token or chat ID");

  const text = `<b>заявка ${patch}</b>\n\n${formatOrderText(data)}`;

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    },
  );

  const result = await response.json();
  if (!result.ok) throw new Error("Failed to send message");

  return { success: true };
}

export async function sendTelegramPhoto(photoBase64: string, patch: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = ID_BY_PATCH[patch as keyof typeof ID_BY_PATCH];

  if (!token || !chatId) throw new Error("Missing Telegram token or chat ID");

  const blob = Buffer.from(photoBase64.split(",")[1], "base64");

  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append(
    "photo",
    new Blob([blob], { type: "image/png" }),
    "order.png",
  );
  formData.append("caption", `заявка ${patch}`);

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendPhoto`,
    { method: "POST", body: formData },
  );

  const result = await response.json();
  if (!result.ok) throw new Error("Failed to send photo");

  return { success: true };
}
