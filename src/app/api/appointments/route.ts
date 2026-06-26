import { NextResponse } from "next/server";
import { business, services } from "@/lib/data";
import { sendAppointmentEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getRazorpayClient } from "@/lib/razorpay";
import { createWhatsAppUrl } from "@/lib/utils";
import { appointmentSchema } from "@/lib/validators";

type MemoryAppointment = {
  id: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  name: string;
  mobile: string;
  email: string;
  notes?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
};

const globalStore = globalThis as unknown as { appointments?: MemoryAppointment[] };
globalStore.appointments ??= [];

export async function GET() {
  if (process.env.DATABASE_URL) {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
      take: 100
    });
    return NextResponse.json({ appointments });
  }

  return NextResponse.json({ appointments: globalStore.appointments });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = appointmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid booking details." }, { status: 400 });
  }

  const appointment = parsed.data;
  const duplicateWhere = {
    staffId: appointment.staffId,
    date: appointment.date,
    time: appointment.time
  };

  if (process.env.DATABASE_URL) {
    const duplicate = await prisma.appointment.findFirst({
      where: {
        ...duplicateWhere,
        status: { in: ["PENDING", "ACCEPTED"] }
      }
    });

    if (duplicate) {
      return NextResponse.json({ ok: false, error: "This time slot was just booked. Please choose another slot." }, { status: 409 });
    }
  } else if (
    globalStore.appointments?.some(
      (item) =>
        item.staffId === appointment.staffId &&
        item.date === appointment.date &&
        item.time === appointment.time &&
        ["PENDING", "ACCEPTED"].includes(item.status)
    )
  ) {
    return NextResponse.json({ ok: false, error: "This time slot was just booked. Please choose another slot." }, { status: 409 });
  }

  const service = services.find((item) => item.id === appointment.serviceId) ?? services[0];
  const advanceAmount = Math.max(500, Math.round(service.price * 0.2));
  const razorpay = getRazorpayClient();
  const paymentOrder =
    appointment.advancePayment && razorpay
      ? await razorpay.orders.create({
          amount: advanceAmount * 100,
          currency: "INR",
          receipt: `tlbp_${Date.now()}`
        })
      : null;

  const id = `TLBP-${Date.now().toString(36).toUpperCase()}`;

  if (process.env.DATABASE_URL) {
    await prisma.appointment.create({
      data: {
        id,
        serviceId: appointment.serviceId,
        staffId: appointment.staffId,
        date: appointment.date,
        time: appointment.time,
        name: appointment.name,
        mobile: appointment.mobile,
        email: appointment.email,
        notes: appointment.notes,
        status: "PENDING",
        paymentStatus: paymentOrder ? "ORDER_CREATED" : "NOT_REQUIRED",
        paymentOrderId: paymentOrder?.id
      }
    });
  } else {
    globalStore.appointments?.push({ id, ...appointment, status: "PENDING" });
  }

  await sendAppointmentEmail(appointment);

  return NextResponse.json({
    ok: true,
    appointmentId: id,
    paymentOrder: paymentOrder
      ? {
          id: paymentOrder.id,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency
        }
      : null,
    whatsappUrl: createWhatsAppUrl(
      `Appointment request ${id} at ${business.name}: ${service.name} on ${appointment.date} at ${appointment.time}.`
    )
  });
}
