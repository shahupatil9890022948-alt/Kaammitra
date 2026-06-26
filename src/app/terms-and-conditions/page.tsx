import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for online bookings and salon services."
};

export default function TermsPage() {
  return (
    <section className="py-16">
      <div className="container max-w-4xl">
        <SectionHeading eyebrow="Policy" title="Terms & Conditions" />
        <div className="space-y-6 rounded-[2rem] border bg-white/70 p-8 leading-8 text-muted-foreground dark:bg-white/5">
          <p>Appointments are confirmed after salon approval. Online booking requests may be rescheduled if staff availability changes.</p>
          <p>Starting prices shown on the website may vary by hair length, product usage, complexity, travel or bridal customization.</p>
          <p>Clients should disclose allergies, skin sensitivity, hair history and medical concerns before service begins.</p>
          <p>Offer availability, package inclusions and payment rules may change based on season and salon capacity.</p>
        </div>
      </div>
    </section>
  );
}
