import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-[2rem] border bg-card/86 p-6 text-card-foreground shadow-luxury", className)}
      {...props}
    />
  );
}
