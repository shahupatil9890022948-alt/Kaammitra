import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PackagesSection } from "@/components/home-sections";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Bridal Packages",
  description: "Luxury bridal makeup packages with HD makeup, hair styling, draping, trials and complete bridal prep."
};

export default function BridalPackagesPage() {
  return (
    <>
      <section className="py-16">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Bridal"
              title="Royal bridal looks for every wedding moment"
              text="From engagement to wedding day, our artists design timeless looks that photograph beautifully and feel comfortable."
              centered={false}
            />
            <Button asChild size="lg">
              <Link href="/book?service=bridal-makeup">Book Bridal Consultation</Link>
            </Button>
          </div>
          <Image
            src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=1100&q=85"
            alt="Luxury bridal makeup"
            width={900}
            height={720}
            className="rounded-[3rem] object-cover shadow-glow"
          />
        </div>
      </section>
      <PackagesSection />
    </>
  );
}
