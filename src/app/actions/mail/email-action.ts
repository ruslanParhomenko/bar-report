"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "cng.nv.rstrnt.mngr@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendNotificationEmail({ text }: { text: string }) {
  const info = await transporter.sendMail({
    from: '"Bar Manager" <cng.nv.rstrnt.mngr@gmail.com>',
    to: "parhomenkogm@gmail.com",
    subject: "Employee Notification",
    text,
    html: `<pre>${text}</pre>`,
  });

  return { success: true, messageId: info.messageId };
}
