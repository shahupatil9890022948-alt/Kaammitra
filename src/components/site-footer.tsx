import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { business, navItems } from "@/lib/data";
import { Button } from "@/components/ui/button";

const legal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Cancellation Policy", href: "/cancellation-policy" }
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-salon-espresso text-white">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-rose-gold">
              <Sparkles className="size-5" />
            </span>
            <div>
              <p className="font-display text-2xl font-semibold">{business.name}</p>
              <p className="text-sm text-white/65">Luxury beauty care for every woman.</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-7 text-white/70">
            Premium salon experiences for bridal makeup, hair transformations, skin rituals, nails and mehendi.
          </p>
          <div className="mt-5 flex gap-2">
            <Button asChild size="sm">
              <a href={`tel:${business.phone}`}>Call Now</a>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-white/20 bg-white/10 text-white">
              <Link href="/book">Book Online</Link>
            </Button>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg">Explore</h3>
          <div className="grid gap-2">
            {navItems.slice(0, 7).map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-white/68 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg">Legal</h3>
          <div className="grid gap-2">
            {legal.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-white/68 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg">Contact</h3>
          <div className="grid gap-3 text-sm text-white/72">
            <a className="flex items-start gap-2 hover:text-white" href={`tel:${business.phone}`}>
              <Phone className="mt-0.5 size-4" /> {business.phone}
            </a>
            <a className="flex items-start gap-2 hover:text-white" href={`mailto:${business.email}`}>
              <Mail className="mt-0.5 size-4" /> {business.email}
            </a>
            <span className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4" /> {business.address}
            </span>
            <div className="flex gap-3 pt-2">
              <Instagram className="size-5" />
              <Facebook className="size-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/55">
        © {new Date().getFullYear()} {business.name}. Crafted for premium salon bookings.
      </div>
    </footer>
  );
}
