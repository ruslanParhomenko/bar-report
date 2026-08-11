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
  try {
    console.log("Sending email with text:", text);
    console.log(
      "Using email:",
      process.env.GMAIL_APP_PASSWORD ? "Password set" : "⚠️ Password NOT set",
    );

    const info = await transporter.sendMail({
      from: '"Bar Manager" <cng.nv.rstrnt.mngr@gmail.com>',
      to: "parhomenkogm@gmail.com",
      subject: "Employee Notification",
      text,
      html: `<pre>${text}</pre>`,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error(
      `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
