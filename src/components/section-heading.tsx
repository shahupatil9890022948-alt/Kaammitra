import { Sparkles } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  text,
  centered = true,
  className
}: {
  eyebrow: string;
  title: string;
  text?: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <FadeIn className={cn("mb-10", centered && "mx-auto max-w-3xl text-center", className)}>
      <p className="mb-3 inline-flex items-center gap-2 rounded-full border bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-salon-rose dark:bg-white/5">
        <Sparkles className="size-3.5" /> {eyebrow}
      </p>
      <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-8 text-muted-foreground">{text}</p> : null}
    </FadeIn>
  );
}
