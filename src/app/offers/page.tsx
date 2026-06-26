import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { offers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Offers",
  description: "View current luxury salon offers, bridal savings and weekday beauty deals."
};

export default function OffersPage() {
  return (
    <section className="py-16">
      <div className="container">
        <SectionHeading eyebrow="Offers" title="Elegant beauty offers for smart bookings" />
        <div className="grid gap-6 md:grid-cols-3">
          {offers.map((offer) => (
            <Card key={offer.title} className="bg-salon-blush dark:bg-white/5">
              <p className="text-sm uppercase tracking-[0.28em] text-salon-rose">{offer.value}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold">{offer.title}</h2>
              <p className="mt-4 text-muted-foreground">{offer.detail}</p>
              <Button asChild className="mt-6">
                <Link href="/book">Claim Offer</Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
