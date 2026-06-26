import type { Metadata } from "next";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { testimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Read customer reviews for Tanishka Ladies Beauty Parlour."
};

export default function TestimonialsPage() {
  return (
    <section className="py-16">
      <div className="container">
        <SectionHeading eyebrow="Testimonials" title="Customer love for Tanishka beauty care" />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.concat(testimonials).map((review, index) => (
            <Card key={`${review.name}-${index}`}>
              <div className="mb-4 flex gap-1 text-salon-gold">
                {Array.from({ length: review.rating }).map((_, star) => (
                  <Star key={star} className="size-4 fill-current" />
                ))}
              </div>
              <p className="leading-8 text-muted-foreground">"{review.text}"</p>
              <p className="mt-5 font-semibold">{review.name}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
