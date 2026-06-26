import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Book Appointment",
  description: "Book salon services online with staff selection, live slots, WhatsApp confirmation and Razorpay advance payment."
};

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const params = await searchParams;

  return (
    <section className="py-16">
      <div className="container">
        <SectionHeading
          eyebrow="Online Booking"
          title="Reserve your luxury salon appointment"
          text="Choose a service, specialist, date and time. We prevent double bookings and send confirmation by email and WhatsApp."
        />
        <BookingForm initialService={params.service} />
      </div>
    </section>
  );
}
