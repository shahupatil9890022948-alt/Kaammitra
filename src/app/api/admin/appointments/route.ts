import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  status: string;
};

const globalStore = globalThis as unknown as { appointments?: MemoryAppointment[] };

function isAuthorized(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const expected = process.env.ADMIN_TOKEN ?? "demo-admin-token";
  return token === expected;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.DATABASE_URL) {
    const appointments = await prisma.appointment.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ appointments });
  }

  return NextResponse.json({ appointments: globalStore.appointments ?? [] });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string; status?: string; date?: string; time?: string };
  if (!body.id) {
    return NextResponse.json({ error: "Appointment id is required." }, { status: 400 });
  }

  if (process.env.DATABASE_URL) {
    const appointment = await prisma.appointment.update({
      where: { id: body.id },
      data: {
        status: body.status,
        date: body.date,
        time: body.time
      }
    });
    return NextResponse.json({ appointment });
  }

  const appointment = globalStore.appointments?.find((item) => item.id === body.id);
  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }
  if (body.status) appointment.status = body.status;
  if (body.date) appointment.date = body.date;
  if (body.time) appointment.time = body.time;

  return NextResponse.json({ appointment });
}
