import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { business } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Tanishka Ladies Beauty Parlour for bookings, bridal consultations and salon support."
};

export default function ContactPage() {
  return (
    <section className="py-16">
      <div className="container">
        <SectionHeading eyebrow="Contact" title="Book, visit or ask us anything" />
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-4">
            {[
              { icon: Phone, label: "Call", value: business.phone, href: `tel:${business.phone}` },
              { icon: Mail, label: "Email", value: business.email, href: `mailto:${business.email}` },
              { icon: MapPin, label: "Visit", value: business.address, href: "#" }
            ].map((item) => (
              <Card key={item.label}>
                <item.icon className="mb-3 size-6 text-salon-rose" />
                <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">{item.label}</p>
                <a href={item.href} className="mt-2 block font-display text-2xl font-semibold">
                  {item.value}
                </a>
              </Card>
            ))}
          </div>
          <Card className="overflow-hidden p-0">
            <iframe
              src={business.mapEmbed}
              className="h-[520px] w-full border-0"
              loading="lazy"
              title="Google Maps location for Tanishka Ladies Beauty Parlour"
            />
          </Card>
        </div>
      </div>
    </section>
  );
}
