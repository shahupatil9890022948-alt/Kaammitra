import type { Metadata } from "next";
import Image from "next/image";
import { AboutPreview } from "@/components/home-sections";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Tanishka Ladies Beauty Parlour, a premium ladies salon focused on trust, hygiene and elegant beauty care."
};

export default function AboutPage() {
  return (
    <>
      <section className="py-16">
        <div className="container">
          <SectionHeading
            eyebrow="Our Story"
            title="A premium salon built around care, confidence and celebration"
            text="Tanishka Ladies Beauty Parlour is designed for women who want expert beauty guidance in a space that feels elegant, respectful and hygienic."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {["Consultation-first care", "Premium salon-grade products", "Bridal and everyday expertise"].map((item) => (
              <Card key={item}>
                <h3 className="font-display text-2xl font-semibold">{item}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Every service is planned around your occasion, skin, hair texture and comfort.
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <AboutPreview />
      <section className="pb-16">
        <div className="container">
          <Image
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=85"
            alt="Beauty products and makeup tools"
            width={1400}
            height={560}
            className="h-[420px] rounded-[3rem] object-cover shadow-glow"
          />
        </div>
      </section>
    </>
  );
}
