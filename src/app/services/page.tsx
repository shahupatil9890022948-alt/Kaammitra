import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore hair, skin, makeup, nails, mehendi and bridal salon services with pricing and durations."
};

export default function ServicesPage() {
  const categories = Array.from(new Set(services.map((service) => service.category)));

  return (
    <section className="py-16">
      <div className="container">
        <SectionHeading eyebrow="Services" title="Premium beauty services with transparent starting prices" />
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <span key={category} className="rounded-full border bg-white/60 px-4 py-2 text-sm dark:bg-white/5">
              {category}
            </span>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
