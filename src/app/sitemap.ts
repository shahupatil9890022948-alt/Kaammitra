import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tanishkabeauty.in";
  const routes = [
    "",
    "/about",
    "/services",
    "/bridal-packages",
    "/gallery",
    "/offers",
    "/testimonials",
    "/blog",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms-and-conditions",
    "/cancellation-policy",
    "/book"
  ];

  return [
    ...routes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ];
}
