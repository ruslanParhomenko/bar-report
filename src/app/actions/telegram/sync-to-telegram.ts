"use server";

type SyncScheduleData = {
  tab: string;
  rowShifts: Array<{
    employee: string;
    employeeId: string;
    shifts: string[];
  }>;
};

export async function syncScheduleToTelegram(data: SyncScheduleData) {
  const SECOND_APP_URL = process.env.SECOND_APP_URL!;

  const response = await fetch(`${SECOND_APP_URL}/api/telegram/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: { text: JSON.stringify(data) },
    }),
  });

  return response.json();
}
