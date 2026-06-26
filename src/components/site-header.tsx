"use client";

import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/82 backdrop-blur-xl">
      <div className="container flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Tanishka home">
          <span className="grid size-11 place-items-center rounded-full bg-rose-gold text-white shadow-glow">
            <Sparkles className="size-5" />
          </span>
          <span>
            <span className="block font-display text-xl font-bold leading-tight">Tanishka</span>
            <span className="block text-xs uppercase tracking-[0.28em] text-salon-rose">Beauty Parlour</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-salon-blush hover:text-foreground dark:hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button asChild>
            <Link href="/book">Book Appointment</Link>
          </Button>
        </div>
        <button
          aria-label="Open navigation"
          className="rounded-full border p-3 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      <div className={cn("container grid gap-2 pb-5 lg:hidden", open ? "block" : "hidden")}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-2xl px-4 py-3 hover:bg-salon-blush" onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <div className="flex gap-2 pt-2">
          <ThemeToggle />
          <Button asChild className="flex-1">
            <Link href="/book" onClick={() => setOpen(false)}>
              Book Now
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
