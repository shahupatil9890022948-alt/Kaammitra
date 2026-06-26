"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { services, blogPosts } from "@/lib/data";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (query.trim().length < 2) {
      return [];
    }
    const needle = query.toLowerCase();
    return [
      ...services
        .filter((service) => `${service.name} ${service.category} ${service.description}`.toLowerCase().includes(needle))
        .map((service) => ({ title: service.name, href: `/book?service=${service.id}`, type: "Service" })),
      ...blogPosts
        .filter((post) => `${post.title} ${post.excerpt}`.toLowerCase().includes(needle))
        .map((post) => ({ title: post.title, href: `/blog/${post.slug}`, type: "Article" }))
    ].slice(0, 6);
  }, [query]);

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="flex items-center gap-3 rounded-full border bg-white/75 px-5 py-3 shadow-luxury backdrop-blur dark:bg-white/5">
        <Search className="size-5 text-salon-rose" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-transparent outline-none"
          placeholder="Search services, offers, bridal tips..."
        />
      </div>
      {results.length ? (
        <div className="absolute inset-x-0 top-16 z-20 rounded-[2rem] border bg-background p-3 shadow-glow">
          {results.map((result) => (
            <Link key={result.href} href={result.href} className="block rounded-2xl px-4 py-3 hover:bg-salon-blush dark:hover:bg-white/10">
              <span className="mr-2 rounded-full bg-salon-blush px-2 py-1 text-xs text-salon-rose dark:bg-white/10">{result.type}</span>
              {result.title}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
