"use server";

export async function sendToTelegram(formData: FormData, patch: string) {
  try {
    const file = formData.get("file") as File | null;
    const caption = formData.get("caption")?.toString() || "";

    if (!file) {
      return { error: "Missing file" };
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId =
      patch === "cucina"
        ? process.env.TELEGRAM_CHAT_CUCINA
        : process.env.TELEGRAM_CHAT_BAR;

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
      "screenshot.png"
    );

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendPhoto`,
      {
        method: "POST",
        body: tgForm,
      }
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
