import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Tanishka Ladies Beauty Parlour website and booking system."
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-16">
      <div className="container max-w-4xl">
        <SectionHeading eyebrow="Policy" title="Privacy Policy" />
        <div className="space-y-6 rounded-[2rem] border bg-white/70 p-8 leading-8 text-muted-foreground dark:bg-white/5">
          <p>We collect contact, appointment and payment-related information only to process bookings, send confirmations, improve service quality and meet legal requirements.</p>
          <p>Payment details are processed securely by Razorpay. We do not store full card, UPI or banking credentials on this website.</p>
          <p>Customer data is protected through Supabase authentication, role-based admin access and least-privilege database policies when configured.</p>
          <p>You may request correction or deletion of your data by contacting the salon directly.</p>
        </div>
      </div>
    </section>
  );
}
