"use server";

import nodemailer from "nodemailer";

interface Props {
  type: "create" | "update";
  userName: string;
  subject: string;
  text: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "cng.nv.rstrnt.mngr@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendNotificationEmail({ subject, text }: Props) {
  await transporter.sendMail({
    from: '"Nuovo Bar Manager" <cng.nv.rstrnt.mngr@gmail.com>',
    to: "parhomenkogm@gmail.com,cng.nv.rstrnt.mngr13@gmail.com,cng.srvlnc@gmail.com,cng.pl.flr.mngr02@gmail.com",
    subject,
    text,
    html: `<pre>${text}</pre>`,
  });
}
