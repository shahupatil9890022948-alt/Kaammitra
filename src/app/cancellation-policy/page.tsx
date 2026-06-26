import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: "Cancellation and rescheduling policy for Tanishka Ladies Beauty Parlour appointments."
};

export default function CancellationPolicyPage() {
  return (
    <section className="py-16">
      <div className="container max-w-4xl">
        <SectionHeading eyebrow="Policy" title="Cancellation Policy" />
        <div className="space-y-6 rounded-[2rem] border bg-white/70 p-8 leading-8 text-muted-foreground dark:bg-white/5">
          <p>Appointments can be rescheduled by contacting the salon at least 8 hours before the booked time.</p>
          <p>Advance payments may be adjusted against a future appointment when cancellation is requested within the allowed window.</p>
          <p>No-shows and very late cancellations may forfeit the advance amount because staff and product time is reserved.</p>
          <p>Bridal package cancellations follow the written quote and event booking terms shared during consultation.</p>
        </div>
      </div>
    </section>
  );
}
