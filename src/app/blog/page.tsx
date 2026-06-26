import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { blogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Beauty tips for bridal skin prep, keratin aftercare and festival salon planning."
};

export default function BlogPage() {
  return (
    <section className="py-16">
      <div className="container">
        <SectionHeading eyebrow="Beauty Journal" title="Expert tips for hair, skin, bridal and festive beauty" />
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full overflow-hidden p-0 transition hover:-translate-y-1">
                <Image src={post.image} alt={post.title} width={700} height={460} className="h-56 w-full object-cover" />
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-salon-rose">{post.date}</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold">{post.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
