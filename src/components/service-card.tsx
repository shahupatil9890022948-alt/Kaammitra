import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: number;
  price: number;
  image: string;
};

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="group overflow-hidden p-0">
      <div className="relative h-64 overflow-hidden rounded-t-[2rem]">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-salon-rose backdrop-blur">
          {service.category}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl font-semibold">{service.name}</h3>
        <p className="mt-2 min-h-16 text-sm leading-7 text-muted-foreground">{service.description}</p>
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4 text-salon-rose" /> {service.duration} min
          </span>
          <span className="font-semibold">Starts {formatCurrency(service.price)}</span>
        </div>
        <Button asChild className="mt-5 w-full">
          <Link href={`/book?service=${service.id}`}>Book Now</Link>
        </Button>
      </div>
    </Card>
  );
}
