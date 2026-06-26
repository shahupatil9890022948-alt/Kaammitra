"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submit() {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = (await response.json()) as { ok: boolean; message?: string; error?: string };
    setMessage(data.message ?? data.error ?? "");
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="rounded-[3rem] bg-rose-gold p-8 text-white shadow-glow md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/75">Newsletter</p>
              <h2 className="mt-3 font-display text-4xl font-semibold">Get offers, bridal tips and beauty reminders.</h2>
            </div>
            <div>
              <div className="flex gap-2 rounded-full bg-white p-2">
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <div className="flex flex-1 items-center gap-2 px-3 text-salon-espresso">
                  <Mail className="size-4" />
                  <input
                    id="newsletter-email"
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <Button type="button" variant="dark" onClick={submit}>
                  Subscribe
                </Button>
              </div>
              {message ? <p className="mt-3 text-sm text-white/80">{message}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
