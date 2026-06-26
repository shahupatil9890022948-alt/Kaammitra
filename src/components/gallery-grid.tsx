"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { gallery } from "@/lib/data";

export function GalleryGrid() {
  const [active, setActive] = useState<(typeof gallery)[number] | null>(null);
  const categories = ["All", ...Array.from(new Set(gallery.map((item) => item.category)))];
  const [category, setCategory] = useState("All");
  const visible = category === "All" ? gallery : gallery.filter((item) => item.category === category);

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-salon-blush data-[active=true]:bg-rose-gold data-[active=true]:text-white"
            data-active={category === item}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="masonry">
        {visible.map((item, index) => (
          <button
            key={item.title}
            onClick={() => setActive(item)}
            className="group relative block w-full overflow-hidden rounded-[2rem] text-left shadow-luxury"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={800}
              height={index % 2 ? 980 : 640}
              className="w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <span className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/82 p-4 font-display text-xl font-semibold backdrop-blur dark:bg-black/55">
              {item.title}
            </span>
          </button>
        ))}
      </div>
      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="fixed left-1/2 top-1/2 z-[70] w-[min(92vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border bg-background p-3 shadow-glow">
          <DialogTitle className="sr-only">{active?.title}</DialogTitle>
          {active ? (
            <Image src={active.image} alt={active.title} width={1200} height={850} className="max-h-[78vh] rounded-[1.5rem] object-cover" />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
