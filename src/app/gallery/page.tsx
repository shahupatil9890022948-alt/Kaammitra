import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery-grid";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Premium salon gallery featuring bridal makeup, hair, facials, nails, mehendi and salon interiors."
};

export default function GalleryPage() {
  return (
    <section className="py-16">
      <div className="container">
        <SectionHeading eyebrow="Gallery" title="Premium transformations and salon moments" />
        <GalleryGrid />
      </div>
    </section>
  );
}
