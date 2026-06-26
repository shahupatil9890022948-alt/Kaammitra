import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Secure salon admin dashboard for appointments, services, offers, customers and revenue analytics.",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return (
    <section className="py-16">
      <div className="container">
        <SectionHeading
          eyebrow="Admin"
          title="Secure salon operations dashboard"
          text="Manage bookings, accept or reject appointments, export reports and prepare Supabase-backed content management."
        />
        <AdminDashboard />
      </div>
    </section>
  );
}
