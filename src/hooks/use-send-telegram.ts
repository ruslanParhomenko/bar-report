import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { useCallback } from "react";
import { toast } from "sonner";

export const useSendTelegram = () => {
  const session = useSession();

  const sendTelegramMessage = useCallback(
    async (data: Record<string, any>, url: string, nameOrder: string) => {
      const userName = session?.data?.user?.name ?? "Неизвестный пользователь";

      const formattedDate = format(new Date(), "dd.MM.yyyy");

      const filteredData: string[] = [];
      for (const [key, value] of Object.entries(data)) {
        if (value == null || value === "") continue;
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item && item.name && item.quantity) {
              filteredData.push(`${item.name}: ${item.quantity}`);
            }
          });
        } else if (
          typeof value === "object" &&
          value !== null &&
          "name" in value &&
          "quantity" in value &&
          typeof (value as any).name === "string" &&
          (value as any).name &&
          (value as any).quantity
        ) {
          filteredData.push(
            `${(value as any).name}: ${(value as any).quantity}`
          );
        } else if (typeof value === "string" || typeof value === "number") {
          filteredData.push(`${key}: ${value}`);
        }
      }

      const body = filteredData
        .map((value, index) => `${index + 1}. ${value}`)
        .join("\n");

      const message = `${nameOrder}:${formattedDate} - ${userName}\n\n${body}`;

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: message }),
        });

        if (!res.ok) throw new Error("Failed to send");

        toast.success("Сообщение успешно отправлено!");
      } catch (e) {
        toast.error("Ошибка при отправке сообщения");
      }
    },
    [session]
  );

  return { sendTelegramMessage };
};
