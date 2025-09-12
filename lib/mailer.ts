import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
});

export async function sendOtpEmail({
  to,
  name,
  code,
}: {
  to: string;
  name: string;
  code: string;
}) {
  const from = process.env.MAIL_FROM || "no-reply@example.com";
  const info = await transporter.sendMail({
    from,
    to,
    subject: "Your Library OTP Code",
    text: `Hello ${name}, your OTP code is ${code}. It expires in 10 minutes.`,
    html: `<p>Hello <strong>${name}</strong>,</p><p>Your OTP code is <strong style="font-size:18px">${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });
  return info.messageId;
}
