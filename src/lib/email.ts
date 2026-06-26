import nodemailer from "nodemailer";
import type { AppointmentInput } from "@/lib/validators";
import { business } from "@/lib/data";

export async function sendAppointmentEmail(appointment: AppointmentInput) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user,
      pass
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? `"${business.name}" <${user}>`,
    to: appointment.email,
    subject: `Your appointment request at ${business.name}`,
    html: `
      <div style="font-family:Poppins,Arial,sans-serif;color:#18100d">
        <h1 style="font-family:Georgia,serif;color:#b76e79">Appointment received</h1>
        <p>Dear ${appointment.name}, thank you for choosing ${business.name}.</p>
        <p><strong>Date:</strong> ${appointment.date}<br/>
        <strong>Time:</strong> ${appointment.time}<br/>
        <strong>Phone:</strong> ${appointment.mobile}</p>
        <p>We will confirm your booking shortly. For urgent changes, call ${business.phone}.</p>
      </div>
    `
  });

  return { skipped: false };
}
