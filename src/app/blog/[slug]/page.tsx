import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  return {
    title: post?.title ?? "Blog",
    description: post?.excerpt
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-16">
      <div className="container max-w-4xl">
        <p className="text-sm uppercase tracking-[0.28em] text-salon-rose">{post.date}</p>
        <h1 className="mt-4 font-display text-5xl font-semibold">{post.title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
        <Image src={post.image} alt={post.title} width={1100} height={620} className="my-10 rounded-[3rem] object-cover shadow-glow" />
        <div className="space-y-6 text-base leading-9 text-muted-foreground">
          <p>
            Premium beauty planning works best when it is calm and consistent. Begin with a consultation, keep your routine simple, and schedule high-impact services early enough to let your skin and hair settle.
          </p>
          <p>
            At Tanishka, every recommendation considers your event calendar, comfort, skin sensitivity, hair texture and desired finish.
          </p>
          <p>
            For personalized guidance, book an appointment and our specialists will design a beauty plan around your occasion.
          </p>
        </div>
      </div>
    </article>
  );
}
