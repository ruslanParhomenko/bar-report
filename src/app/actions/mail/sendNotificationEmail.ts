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
  await transporter.sendMail({
    from: '"Bar Manager" <cng.nv.rstrnt.mngr@gmail.com>',
    to: "parhomenkogm@gmail.com",
    text,
    html: `<pre>${text}</pre>`,
  });
}
