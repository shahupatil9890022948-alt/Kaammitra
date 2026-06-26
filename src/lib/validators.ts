import { z } from "zod";

export const appointmentSchema = z.object({
  serviceId: z.string().min(1, "Please choose a service."),
  staffId: z.string().min(1, "Please choose a specialist."),
  date: z.string().min(1, "Please choose a date."),
  time: z.string().min(1, "Please choose a time slot."),
  name: z.string().min(2, "Please enter your full name."),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number."),
  email: z.string().email("Enter a valid email address."),
  notes: z.string().max(500).optional(),
  language: z.enum(["en", "mr", "hi"]).default("en"),
  advancePayment: z.boolean().default(false)
});

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address.")
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
