import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validators";

const globalStore = globalThis as unknown as { subscribers?: string[] };
globalStore.subscribers ??= [];

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!globalStore.subscribers?.includes(parsed.data.email)) {
    globalStore.subscribers?.push(parsed.data.email);
  }

  return NextResponse.json({
    ok: true,
    message: "You are subscribed. Watch your inbox for luxury beauty offers."
  });
}
