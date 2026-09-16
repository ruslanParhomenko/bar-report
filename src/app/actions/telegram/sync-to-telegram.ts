"use server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_SYNC_BOT_TOKEN!;
const TELEGRAM_GROUP_ID = process.env.TELEGRAM_SYNC_GROUP_ID!;

const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

type ShiftRow = {
  employee: string;
  employeeId: string;
  shifts: string[];
};

type SyncScheduleData = {
  tab: string;
  rowShifts: ShiftRow[];
};

async function telegramRequest<T>(
  method: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`${TELEGRAM_API}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.ok) {
    throw new Error(
      `Telegram ${method}: ${result.description ?? "Unknown error"}`,
    );
  }

  return result.result;
}

export async function syncScheduleToTelegram(data: SyncScheduleData) {
  const text = JSON.stringify(data);

  if (text.length > 4096) {
    throw new Error(
      `Schedule JSON слишком большой для Telegram: ${text.length} символов`,
    );
  }

  const message = await telegramRequest<{
    message_id: number;
  }>("sendMessage", {
    chat_id: TELEGRAM_GROUP_ID,
    text,
  });

  return {
    messageId: message.message_id,
  };
}
