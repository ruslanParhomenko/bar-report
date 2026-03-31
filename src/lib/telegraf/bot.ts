import { Telegraf } from "telegraf";

import admin from "firebase-admin";
import { dbAdmin } from "../firebase-admin";

// Временный объект для хранения "текущей формы" между шагами
// В serverless это будет потеряно, поэтому сохраняем промежуточное в Firestore
const tempState: Record<string, any> = {};

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.command("replace", async (ctx) => {
  const chatId = ctx.chat.id.toString();

  // Инициализация временной формы
  tempState[chatId] = {};
  await ctx.reply("Введите имя сотрудника, которого заменяем:");
});

bot.on("text", async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const text = ctx.message.text;

  if (!tempState[chatId]) {
    return ctx.reply("Нажмите /replace чтобы создать новую заявку");
  }

  const form = tempState[chatId];

  // Шаг 1 — заменяемый
  if (!form.original) {
    form.original = text;
    return ctx.reply("Введите имя заменяющего сотрудника:");
  }

  // Шаг 2 — заменяющий
  if (!form.replacement) {
    form.replacement = text;
    return ctx.reply("Введите смену (утренняя/дневная/вечерняя):");
  }

  // Шаг 3 — смена
  if (!form.shift) {
    form.shift = text;
    form.created_at = admin.firestore.FieldValue.serverTimestamp();

    // Сохраняем в Firestore
    const docRef = dbAdmin.collection("telegram_forms").doc(chatId);
    await dbAdmin.runTransaction(async (t) => {
      const doc = await t.get(docRef);
      if (!doc.exists) {
        t.set(docRef, { replacements: [form] });
      } else {
        const data = doc.data()!;
        const arr = data.replacements || [];
        arr.push(form);
        t.update(docRef, { replacements: arr });
      }
    });

    delete tempState[chatId]; // очистка временной формы
    return ctx.reply(
      `✅ Заявка добавлена:
Заменяемый: ${form.original}
Заменяющий: ${form.replacement}
Смена: ${form.shift}`,
    );
  }
});
