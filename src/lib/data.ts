import {
  Award,
  CalendarCheck,
  Gem,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Star,
  Users
} from "lucide-react";

export const business = {
  name: "Tanishka Ladies Beauty Parlour",
  type: "Ladies Beauty Salon",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "hello@tanishkabeauty.in",
  address: "Near Market Road, Pune, Maharashtra 411001",
  hours: "Mon-Sun, 10:00 AM - 8:00 PM",
  mapEmbed:
    "https://www.google.com/maps?q=Pune%20Maharashtra%20beauty%20salon&output=embed",
  instagram: "@tanishkabeauty",
  currency: "₹"
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Bridal", href: "/bridal-packages" },
  { label: "Gallery", href: "/gallery" },
  { label: "Offers", href: "/offers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" }
];

export const services = [
  {
    id: "haircut",
    category: "Hair",
    name: "Signature Haircut",
    description: "Face-framing consultation, luxury wash, precision cut and soft finish.",
    duration: 45,
    price: 699,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "hair-spa",
    category: "Hair",
    name: "Aroma Hair Spa",
    description: "Deep repair ritual with steam therapy for shine, softness and scalp comfort.",
    duration: 75,
    price: 1499,
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "hair-colour",
    category: "Hair",
    name: "Global Hair Colour",
    description: "Premium color consultation with ammonia-free options and gloss finish.",
    duration: 120,
    price: 2499,
    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "keratin",
    category: "Hair Treatments",
    name: "Keratin Smooth Ritual",
    description: "Frizz-control treatment for polished, manageable hair with mirror shine.",
    duration: 150,
    price: 4499,
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "smoothening",
    category: "Hair Treatments",
    name: "Hair Smoothening",
    description: "Sleek finish treatment customized to hair texture and lifestyle.",
    duration: 180,
    price: 4999,
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "rebonding",
    category: "Hair Treatments",
    name: "Hair Rebonding",
    description: "Long-lasting straightening service with post-care protection plan.",
    duration: 210,
    price: 5999,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "facial",
    category: "Skin",
    name: "Luxury Gold Facial",
    description: "Brightening cleanse, massage, mask and hydration for event-ready glow.",
    duration: 60,
    price: 1899,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cleanup",
    category: "Skin",
    name: "Express Cleanup",
    description: "Quick pore care and hydration for fresh, everyday radiance.",
    duration: 35,
    price: 799,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "waxing",
    category: "Essentials",
    name: "Premium Waxing",
    description: "Hygienic Rica and chocolate wax options for smooth, comfortable results.",
    duration: 45,
    price: 499,
    image: "https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "threading",
    category: "Essentials",
    name: "Brow Threading",
    description: "Balanced shaping for clean, expressive brows.",
    duration: 15,
    price: 99,
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "bleach",
    category: "Skin",
    name: "D-Tan Bleach",
    description: "Gentle brightening service for face, neck and hands.",
    duration: 30,
    price: 399,
    image: "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "manicure",
    category: "Nails",
    name: "Spa Manicure",
    description: "Cuticle care, scrub, massage and polish with luxe hand hydration.",
    duration: 40,
    price: 699,
    image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "pedicure",
    category: "Nails",
    name: "Royal Pedicure",
    description: "Relaxing foot soak, exfoliation, massage and premium polish.",
    duration: 55,
    price: 999,
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "nail-art",
    category: "Nails",
    name: "Nail Art Studio",
    description: "Minimal, bridal and festive nail art with gel finish options.",
    duration: 75,
    price: 1299,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "bridal-makeup",
    category: "Makeup",
    name: "Bridal Makeup",
    description: "HD bridal glam with draping, hair styling and touch-up guidance.",
    duration: 180,
    price: 11999,
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "party-makeup",
    category: "Makeup",
    name: "Party Makeup",
    description: "Elegant event makeup for birthdays, sangeet, receptions and celebrations.",
    duration: 90,
    price: 2999,
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "mehendi",
    category: "Mehendi",
    name: "Designer Mehendi",
    description: "Traditional, Arabic and bridal patterns drawn with fresh natural paste.",
    duration: 120,
    price: 1999,
    image: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "skin-treatments",
    category: "Skin",
    name: "Skin Treatment Plan",
    description: "Consultation-led treatments for dullness, tan, acne care and hydration.",
    duration: 60,
    price: 2499,
    image: "https://images.unsplash.com/photo-1556228724-4f0718bd3d8c?auto=format&fit=crop&w=900&q=80"
  }
];

export const staff = [
  { id: "sneha", name: "Sneha Patil", role: "Senior Beauty Artist", specialty: "Bridal and HD Makeup" },
  { id: "priya", name: "Priya Sharma", role: "Hair Expert", specialty: "Color, Keratin and Styling" },
  { id: "anuja", name: "Anuja Deshmukh", role: "Skin Therapist", specialty: "Facials and Skin Rituals" },
  { id: "meera", name: "Meera Khan", role: "Nail and Mehendi Artist", specialty: "Nails and Designer Mehendi" }
];

export const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM"
];

export const whyChooseUs = [
  { title: "Certified Artists", text: "Specialists trained in modern makeup, hair and skin rituals.", icon: Award },
  { title: "Premium Hygiene", text: "Sanitized tools, single-use disposables and calm private spaces.", icon: ShieldCheck },
  { title: "Luxury Products", text: "Salon-grade products selected for Indian skin and hair needs.", icon: Gem },
  { title: "Warm Care", text: "Every guest gets patient consultation and honest recommendations.", icon: HeartHandshake }
];

export const stats = [
  { label: "Happy Clients", value: "8k+", icon: Users },
  { label: "Bridal Looks", value: "950+", icon: Sparkles },
  { label: "Average Rating", value: "4.9", icon: Star },
  { label: "Easy Bookings", value: "24/7", icon: CalendarCheck }
];

export const packages = [
  {
    name: "Glow Ritual",
    price: 2999,
    includes: ["Gold facial", "Eyebrow threading", "Hair blow dry", "Nail polish"],
    ideal: "Festive glow"
  },
  {
    name: "Bride Essential",
    price: 14999,
    includes: ["HD bridal makeup", "Hair styling", "Saree draping", "Trial consultation"],
    ideal: "Wedding day"
  },
  {
    name: "Royal Bride",
    price: 24999,
    includes: ["Bridal makeup", "Engagement look", "Mehendi styling", "Skin prep session"],
    ideal: "Complete bridal journey"
  }
];

export const offers = [
  { title: "First Visit Glow", value: "20% OFF", detail: "On facial and hair spa combos this month." },
  { title: "Bride Tribe", value: "Save ₹3000", detail: "For bookings of bride plus 3 family members." },
  { title: "Weekday Luxury", value: "Free Add-on", detail: "Complimentary threading with weekday cleanup." }
];

export const testimonials = [
  {
    name: "Aditi K.",
    text: "My bridal look stayed fresh through the full ceremony. The team made me feel calm and beautiful.",
    rating: 5
  },
  {
    name: "Nisha R.",
    text: "The salon feels premium, clean and welcoming. Their keratin treatment changed my hair completely.",
    rating: 5
  },
  {
    name: "Farah S.",
    text: "I booked online, paid the advance and got confirmation immediately. Very professional experience.",
    rating: 5
  }
];

export const gallery = [
  { category: "Bridal", title: "Royal Maharashtrian Bride", image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=900&q=80" },
  { category: "Hair", title: "Soft Curls Finish", image: "https://images.unsplash.com/photo-1522336284037-91f7da073525?auto=format&fit=crop&w=900&q=80" },
  { category: "Facial", title: "Radiance Facial Ritual", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80" },
  { category: "Nails", title: "Rose Gold Nail Art", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80" },
  { category: "Mehendi", title: "Intricate Mehendi", image: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fit=crop&w=900&q=80" },
  { category: "Salon Interior", title: "Luxury Treatment Space", image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=900&q=80" }
];

export const blogPosts = [
  {
    slug: "bridal-skin-prep-timeline",
    title: "Bridal Skin Prep Timeline for a Radiant Wedding Glow",
    excerpt: "A practical guide to facials, hydration and trials before the big day.",
    date: "2026-02-12",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
  },
  {
    slug: "keratin-aftercare",
    title: "Keratin Aftercare: Keep Hair Smooth for Longer",
    excerpt: "Simple wash, product and styling habits that preserve salon shine.",
    date: "2026-03-04",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80"
  },
  {
    slug: "festival-beauty-checklist",
    title: "Festival Beauty Checklist for Busy Women",
    excerpt: "Plan threading, waxing, nails and hair styling without last-minute stress.",
    date: "2026-04-18",
    image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80"
  }
];

export const faqs = [
  {
    question: "Do I need to pay in advance?",
    answer: "A small Razorpay advance can be collected for selected services. The balance is paid at the salon."
  },
  {
    question: "Can I reschedule my appointment?",
    answer: "Yes. Use the reschedule link in your confirmation or call us at least 8 hours before your appointment."
  },
  {
    question: "Do you provide bridal trials?",
    answer: "Yes. Bridal trials and consultations are available by appointment."
  },
  {
    question: "Which languages are supported?",
    answer: "The website includes English, Marathi and Hindi interface content for key booking touchpoints."
  }
];
