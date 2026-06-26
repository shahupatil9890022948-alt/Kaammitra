"use client";

import { Bot, MessageCircle, Phone, Send, X } from "lucide-react";
import { useState } from "react";
import { business } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { createWhatsAppUrl } from "@/lib/utils";

const prompts = [
  "Which facial is best before a wedding?",
  "Suggest a hair treatment for frizz.",
  "Book bridal consultation."
];

export function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false);
  const [reply, setReply] = useState("Hi! I am Tanishka's AI Beauty Assistant. Ask me about services, prices or bridal prep.");

  function answer(prompt: string) {
    if (prompt.includes("facial")) {
      setReply("For bridal glow, start with a consultation and choose Gold Facial or Skin Treatment Plan 2-4 weeks before the event.");
      return;
    }
    if (prompt.includes("hair")) {
      setReply("For frizz, Keratin Smooth Ritual is ideal. For permanent straightness, Smoothening or Rebonding may suit better.");
      return;
    }
    setReply("Tap Book Appointment, choose Bridal Makeup, select a staff member and share your date. We will confirm quickly.");
  }

  return (
    <>
      <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3">
        <a
          href={createWhatsAppUrl("Hi Tanishka, I want to book an appointment.")}
          aria-label="WhatsApp Tanishka"
          className="grid size-12 place-items-center rounded-full bg-green-500 text-white shadow-glow"
        >
          <MessageCircle className="size-5" />
        </a>
        <a
          href={`tel:${business.phone}`}
          aria-label="Call Tanishka"
          className="grid size-12 place-items-center rounded-full bg-salon-espresso text-white shadow-luxury"
        >
          <Phone className="size-5" />
        </a>
        <button
          aria-label="Open beauty assistant"
          onClick={() => setChatOpen(true)}
          className="grid size-12 place-items-center rounded-full bg-rose-gold text-white shadow-glow"
        >
          <Bot className="size-5" />
        </button>
      </div>
      {chatOpen ? (
        <div className="fixed bottom-24 right-4 z-50 w-[min(92vw,360px)] rounded-[2rem] border bg-background p-4 shadow-glow">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-semibold">AI Beauty Assistant</p>
              <p className="text-xs text-muted-foreground">Instant service guidance</p>
            </div>
            <button aria-label="Close chat" onClick={() => setChatOpen(false)} className="rounded-full border p-2">
              <X className="size-4" />
            </button>
          </div>
          <div className="rounded-3xl bg-salon-blush p-4 text-sm leading-6 text-salon-espresso dark:bg-white/10 dark:text-white">{reply}</div>
          <div className="mt-3 grid gap-2">
            {prompts.map((prompt) => (
              <button key={prompt} className="rounded-2xl border px-3 py-2 text-left text-sm hover:bg-salon-blush dark:hover:bg-white/10" onClick={() => answer(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
          <Button asChild className="mt-3 w-full">
            <a href={createWhatsAppUrl(reply)}>
              <Send className="size-4" /> Continue on WhatsApp
            </a>
          </Button>
        </div>
      ) : null}
    </>
  );
}
