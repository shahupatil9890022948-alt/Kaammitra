"use client";

import jsPDF from "jspdf";
import { Download, Lock, RefreshCw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { services, staff } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

type Appointment = {
  id: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  name: string;
  mobile: string;
  email: string;
  status: string;
};

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [message, setMessage] = useState("Use ADMIN_TOKEN. Demo fallback is demo-admin-token.");

  const revenue = useMemo(
    () =>
      appointments.reduce((total, appointment) => {
        const service = services.find((item) => item.id === appointment.serviceId);
        return total + Math.round((service?.price ?? 0) * 0.2);
      }, 0),
    [appointments]
  );

  async function load() {
    const response = await fetch("/api/admin/appointments", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = (await response.json()) as { appointments?: Appointment[]; error?: string };
    if (!response.ok) {
      setMessage(data.error ?? "Could not load appointments.");
      return;
    }
    setAppointments(data.appointments ?? []);
    setMessage("Appointments loaded securely.");
  }

  async function update(id: string, status: string) {
    const response = await fetch("/api/admin/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status })
    });
    if (response.ok) {
      await load();
    }
  }

  function exportCsv() {
    const header = "ID,Name,Mobile,Email,Service,Staff,Date,Time,Status";
    const rows = appointments.map((appointment) =>
      [
        appointment.id,
        appointment.name,
        appointment.mobile,
        appointment.email,
        services.find((item) => item.id === appointment.serviceId)?.name ?? appointment.serviceId,
        staff.find((item) => item.id === appointment.staffId)?.name ?? appointment.staffId,
        appointment.date,
        appointment.time,
        appointment.status
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "tanishka-appointments.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    const doc = new jsPDF();
    doc.text("Tanishka Appointments", 14, 18);
    appointments.slice(0, 24).forEach((appointment, index) => {
      doc.text(`${appointment.id} | ${appointment.name} | ${appointment.date} ${appointment.time} | ${appointment.status}`, 14, 32 + index * 8);
    });
    doc.save("tanishka-appointments.pdf");
  }

  return (
    <div className="grid gap-8">
      <Card className="grid gap-4 md:grid-cols-[1fr_auto]">
        <label className="grid gap-2 text-sm font-medium">
          Admin Token
          <input
            className="rounded-2xl border bg-background px-4 py-3"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Enter ADMIN_TOKEN"
          />
        </label>
        <Button className="self-end" onClick={load}>
          <Lock className="size-4" /> Login Securely
        </Button>
        <p className="text-sm text-muted-foreground md:col-span-2">{message}</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Bookings", appointments.length],
          ["Pending", appointments.filter((item) => item.status === "PENDING").length],
          ["Accepted", appointments.filter((item) => item.status === "ACCEPTED").length],
          ["Advance Revenue", formatCurrency(revenue)]
        ].map(([label, value]) => (
          <Card key={label}>
            <ShieldCheck className="mb-3 size-5 text-salon-rose" />
            <p className="font-display text-3xl font-semibold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </Card>
        ))}
      </div>
      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-3xl font-semibold">Appointments</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={load}>
              <RefreshCw className="size-4" /> Refresh
            </Button>
            <Button variant="outline" onClick={exportCsv}>
              <Download className="size-4" /> CSV
            </Button>
            <Button variant="outline" onClick={exportPdf}>
              <Download className="size-4" /> PDF
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Customer</th>
                <th>Service</th>
                <th>Staff</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-t">
                  <td className="py-4">
                    <p className="font-semibold">{appointment.name}</p>
                    <p className="text-xs text-muted-foreground">{appointment.mobile} · {appointment.email}</p>
                  </td>
                  <td>{services.find((item) => item.id === appointment.serviceId)?.name ?? appointment.serviceId}</td>
                  <td>{staff.find((item) => item.id === appointment.staffId)?.name ?? appointment.staffId}</td>
                  <td>{appointment.date} {appointment.time}</td>
                  <td>{appointment.status}</td>
                  <td className="flex gap-2 py-4">
                    <Button size="sm" onClick={() => update(appointment.id, "ACCEPTED")}>Accept</Button>
                    <Button size="sm" variant="outline" onClick={() => update(appointment.id, "REJECTED")}>Reject</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {["Manage services & prices", "Upload gallery images", "Manage offers & testimonials"].map((title) => (
          <Card key={title}>
            <h3 className="font-display text-2xl font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Ready for Supabase-backed CRUD workflows; connect storage and row-level policies using the included schema.
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
