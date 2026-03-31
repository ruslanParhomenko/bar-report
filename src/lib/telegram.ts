import { Telegraf } from "telegraf";

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.start((ctx) => {
  ctx.reply("Выберите действие", {
    reply_markup: {
      keyboard: [["Создать замену"]],
      resize_keyboard: true,
    },
  });
});
