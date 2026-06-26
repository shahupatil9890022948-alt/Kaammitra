import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, MessageCircle, Phone, PlayCircle, Star } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { business, gallery, offers, packages, services, stats, testimonials, whyChooseUs } from "@/lib/data";
import { createWhatsAppUrl, formatCurrency } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      <div className="container grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <FadeIn>
          <p className="mb-5 inline-flex rounded-full border bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-salon-rose dark:bg-white/5">
            Premium Ladies Beauty Salon
          </p>
          <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            Luxury beauty rituals for your most confident glow.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-muted-foreground">
            Tanishka Ladies Beauty Parlour blends bridal artistry, modern hair care, radiant skin rituals and warm hospitality for women of every age.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/book">
                Book Appointment <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={createWhatsAppUrl("Hi Tanishka, I want to book a salon appointment.")}>
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="dark">
              <a href={`tel:${business.phone}`}>
                <Phone className="size-4" /> Call Now
              </a>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border bg-white/60 p-4 dark:bg-white/5">
                <stat.icon className="mb-2 size-5 text-salon-rose" />
                <p className="font-display text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.15} className="relative">
          <div className="luxury-border rounded-[3rem]">
            <div className="relative h-[560px] overflow-hidden rounded-[3rem] shadow-glow">
              <Image
                src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=85"
                alt="Luxury bridal makeup at Tanishka Ladies Beauty Parlour"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="glass absolute -bottom-6 left-5 max-w-xs rounded-[2rem] p-5 shadow-luxury">
            <div className="flex gap-1 text-salon-gold">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" />
              ))}
            </div>
            <p className="mt-2 text-sm font-semibold">Rated 4.9 by brides, professionals and families.</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function FeaturedServices() {
  return (
    <section className="py-16">
      <div className="container">
        <SectionHeading eyebrow="Signature Services" title="Salon care that feels personal and premium" text="Book high-demand rituals online with transparent pricing, durations and specialist selection." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service) => (
            <FadeIn key={service.id}>
              <ServiceCard service={service} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutPreview() {
  return (
    <section className="py-16">
      <div className="container grid items-center gap-10 lg:grid-cols-2">
        <FadeIn>
          <Image
            src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=1100&q=80"
            alt="Elegant salon interior"
            width={900}
            height={720}
            className="rounded-[3rem] object-cover shadow-glow"
          />
        </FadeIn>
        <FadeIn delay={0.1}>
          <SectionHeading
            eyebrow="About Tanishka"
            title="A calm, hygienic and elegant space for women"
            text="Created for everyday confidence and once-in-a-lifetime celebrations, our salon pairs premium products with thoughtful consultation."
            centered={false}
            className="mb-6"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {whyChooseUs.map((item) => (
              <Card key={item.title} className="p-5">
                <item.icon className="mb-3 size-6 text-salon-rose" />
                <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
              </Card>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function PackagesSection() {
  return (
    <section className="py-16">
      <div className="container">
        <SectionHeading eyebrow="Beauty Packages" title="Curated packages for glow, events and brides" />
        <div className="grid gap-6 lg:grid-cols-3">
          {packages.map((item) => (
            <FadeIn key={item.name}>
              <Card className="h-full">
                <p className="text-sm uppercase tracking-[0.28em] text-salon-rose">{item.ideal}</p>
                <h3 className="mt-3 font-display text-3xl font-semibold">{item.name}</h3>
                <p className="mt-3 text-2xl font-semibold">{formatCurrency(item.price)}</p>
                <ul className="mt-6 grid gap-3 text-sm text-muted-foreground">
                  {item.includes.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <BadgeCheck className="size-5 shrink-0 text-salon-rose" /> {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full">
                  <Link href="/book">Reserve Package</Link>
                </Button>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GalleryPreview() {
  return (
    <section className="py-16">
      <div className="container">
        <SectionHeading eyebrow="Before & After" title="A glimpse of bridal, hair, facial, nails and mehendi work" />
        <div className="grid gap-4 md:grid-cols-3">
          {gallery.slice(0, 6).map((item) => (
            <FadeIn key={item.title}>
              <Link href="/gallery" className="group relative block h-80 overflow-hidden rounded-[2rem] shadow-luxury">
                <Image src={item.image} alt={item.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/80 p-4 font-display text-xl font-semibold backdrop-blur dark:bg-black/55">
                  {item.title}
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SocialProofSection() {
  return (
    <section className="py-16">
      <div className="container">
        <SectionHeading eyebrow="Reviews" title="Trusted by women for memorable beauty moments" />
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((review) => (
            <Card key={review.name}>
              <div className="mb-4 flex gap-1 text-salon-gold">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
              <p className="leading-8 text-muted-foreground">&ldquo;{review.text}&rdquo;</p>
              <p className="mt-5 font-semibold">{review.name}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {offers.map((offer) => (
            <Card key={offer.title} className="bg-salon-blush dark:bg-white/5">
              <p className="text-sm uppercase tracking-[0.28em] text-salon-rose">{offer.value}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold">{offer.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{offer.detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstagramAndMap() {
  return (
    <section className="py-16">
      <div className="container grid gap-8 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-salon-rose">Instagram Feed</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">Reels, bridal reveals and fresh transformations</h2>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3">
            {gallery.slice(0, 6).map((item) => (
              <div key={item.title} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={item.image} alt={item.title} fill sizes="180px" className="object-cover" />
                <PlayCircle className="absolute bottom-2 right-2 size-5 text-white drop-shadow" />
              </div>
            ))}
          </div>
        </Card>
        <Card className="overflow-hidden p-0">
          <div className="p-6">
            <p className="flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-salon-rose">
              <MapPin className="size-4" /> Visit Us
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold">Find Tanishka on Google Maps</h2>
          </div>
          <iframe
            src={business.mapEmbed}
            className="h-80 w-full border-0"
            loading="lazy"
            title="Google Maps location for Tanishka Ladies Beauty Parlour"
          />
        </Card>
      </div>
    </section>
  );
}
