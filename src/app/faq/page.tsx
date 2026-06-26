import type { Metadata } from "next";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { faqs } from "@/lib/data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about appointments, payments, rescheduling, bridal trials and languages."
};

export default function FaqPage() {
  return (
    <section className="py-16">
      <div className="container max-w-4xl">
        <SectionHeading eyebrow="FAQ" title="Helpful answers before you book" />
        <Accordion.Root type="single" collapsible className="grid gap-4">
          {faqs.map((item, index) => (
            <Accordion.Item key={item.question} value={`item-${index}`} className="rounded-[2rem] border bg-white/70 px-6 dark:bg-white/5">
              <Accordion.Trigger className="flex w-full items-center justify-between py-5 text-left font-display text-xl font-semibold">
                {item.question}
                <ChevronDown className="size-5 transition data-[state=open]:rotate-180" />
              </Accordion.Trigger>
              <Accordion.Content className="pb-5 text-sm leading-7 text-muted-foreground">{item.answer}</Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
