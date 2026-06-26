"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { services, staff, timeSlots } from "@/lib/data";
import { createWhatsAppUrl, formatCurrency } from "@/lib/utils";
import { appointmentSchema, type AppointmentInput } from "@/lib/validators";

type BookingResponse = {
  ok: boolean;
  appointmentId?: string;
  paymentOrder?: { id: string; amount: number; currency: string };
  whatsappUrl?: string;
  error?: string;
};

export function BookingForm({ initialService }: { initialService?: string }) {
  const [availableSlots, setAvailableSlots] = useState(timeSlots);
  const [result, setResult] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const form = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema) as Resolver<AppointmentInput>,
    defaultValues: {
      serviceId: initialService ?? services[0].id,
      staffId: staff[0].id,
      date: today,
      time: timeSlots[0],
      name: "",
      mobile: "",
      email: "",
      notes: "",
      language: "en",
      advancePayment: true
    }
  });

  const serviceId = form.watch("serviceId");
  const staffId = form.watch("staffId");
  const date = form.watch("date");
  const selectedService = useMemo(() => services.find((service) => service.id === serviceId) ?? services[0], [serviceId]);

  useEffect(() => {
    async function loadSlots() {
      const response = await fetch(`/api/appointments/slots?staffId=${staffId}&date=${date}`);
      const data = (await response.json()) as { slots?: string[] };
      setAvailableSlots(data.slots?.length ? data.slots : timeSlots);
      if (data.slots?.length && !data.slots.includes(form.getValues("time"))) {
        form.setValue("time", data.slots[0]);
      }
    }

    void loadSlots();
  }, [date, staffId, form]);

  async function onSubmit(values: AppointmentInput) {
    setLoading(true);
    setResult(null);

    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = (await response.json()) as BookingResponse;
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="grid gap-8 rounded-[2.5rem] border bg-white/72 p-5 shadow-glow backdrop-blur dark:bg-white/5 lg:grid-cols-[1fr_0.75fr] lg:p-8">
      <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Service
            <select className="rounded-2xl border bg-background px-4 py-3" {...form.register("serviceId")}>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Staff Member
            <select className="rounded-2xl border bg-background px-4 py-3" {...form.register("staffId")}>
              {staff.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} - {person.specialty}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Date
            <input min={today} type="date" className="rounded-2xl border bg-background px-4 py-3" {...form.register("date")} />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Time Slot
            <select className="rounded-2xl border bg-background px-4 py-3" {...form.register("time")}>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            Name
            <input className="rounded-2xl border bg-background px-4 py-3" placeholder="Your full name" {...form.register("name")} />
            {form.formState.errors.name ? <span className="text-xs text-red-500">{form.formState.errors.name.message}</span> : null}
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Mobile
            <input className="rounded-2xl border bg-background px-4 py-3" placeholder="9876543210" {...form.register("mobile")} />
            {form.formState.errors.mobile ? <span className="text-xs text-red-500">{form.formState.errors.mobile.message}</span> : null}
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input className="rounded-2xl border bg-background px-4 py-3" placeholder="you@example.com" {...form.register("email")} />
            {form.formState.errors.email ? <span className="text-xs text-red-500">{form.formState.errors.email.message}</span> : null}
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Notes
          <textarea className="min-h-28 rounded-2xl border bg-background px-4 py-3" placeholder="Occasion, preferences, skin/hair concerns..." {...form.register("notes")} />
        </label>
        <div className="grid gap-4 rounded-3xl bg-salon-blush p-4 dark:bg-white/10 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Language
            <select className="rounded-2xl border bg-background px-4 py-3" {...form.register("language")}>
              <option value="en">English</option>
              <option value="mr">Marathi</option>
              <option value="hi">Hindi</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border bg-background px-4 py-3 text-sm font-medium">
            <input type="checkbox" {...form.register("advancePayment")} />
            Pay booking advance by Razorpay
          </label>
        </div>
        <Button size="lg" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <CalendarDays className="size-4" />}
          Request Appointment
        </Button>
      </form>
      <aside className="rounded-[2rem] bg-salon-espresso p-6 text-white">
        <p className="text-sm uppercase tracking-[0.28em] text-salon-champagne">Booking Summary</p>
        <h3 className="mt-4 font-display text-3xl">{selectedService.name}</h3>
        <p className="mt-3 text-sm leading-7 text-white/70">{selectedService.description}</p>
        <div className="mt-6 grid gap-3 text-sm">
          <span>Duration: {selectedService.duration} minutes</span>
          <span>Starting price: {formatCurrency(selectedService.price)}</span>
          <span>Advance: {formatCurrency(Math.max(500, Math.round(selectedService.price * 0.2)))}</span>
        </div>
        <div className="mt-6 rounded-3xl bg-white/10 p-4 text-sm leading-7">
          <CreditCard className="mb-2 size-5 text-salon-gold" />
          Razorpay supports UPI, cards and net banking when API keys are configured.
        </div>
        {result ? (
          <div className="mt-6 rounded-3xl bg-white/10 p-4">
            {result.ok ? (
              <>
                <CheckCircle2 className="mb-2 size-6 text-green-300" />
                <p className="font-semibold">Appointment request received.</p>
                <p className="mt-1 text-sm text-white/70">ID: {result.appointmentId}</p>
                <a className="mt-3 inline-flex text-sm font-semibold text-salon-gold" href={result.whatsappUrl ?? createWhatsAppUrl("Booking confirmed")}>
                  Send WhatsApp confirmation
                </a>
              </>
            ) : (
              <p className="text-sm text-red-200">{result.error}</p>
            )}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
