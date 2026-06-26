import { NextResponse } from "next/server";
import { timeSlots } from "@/lib/data";
import { prisma } from "@/lib/prisma";

const globalStore = globalThis as unknown as {
  appointments?: Array<{ staffId: string; date: string; time: string; status: string }>;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const staffId = searchParams.get("staffId") ?? "";
  const date = searchParams.get("date") ?? "";

  if (!staffId || !date) {
    return NextResponse.json({ slots: timeSlots });
  }

  const booked = process.env.DATABASE_URL
    ? await prisma.appointment.findMany({
        where: {
          staffId,
          date,
          status: { in: ["PENDING", "ACCEPTED"] }
        },
        select: { time: true }
      })
    : (globalStore.appointments ?? []).filter(
        (appointment) =>
          appointment.staffId === staffId && appointment.date === date && ["PENDING", "ACCEPTED"].includes(appointment.status)
      );

  const unavailable = new Set(booked.map((appointment) => appointment.time));

  return NextResponse.json({
    slots: timeSlots.filter((slot) => !unavailable.has(slot))
  });
}
