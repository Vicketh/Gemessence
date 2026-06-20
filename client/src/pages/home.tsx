import { Navbar } from "@/components/layout/navbar";
import { GemessenceLogo } from "@/components/ui/gemessence-logo";
import { WhatsAppFloatingButton } from "@/components/ui/whatsapp-floating-button";
import { resolveImageUrl } from "@/lib/utils";
import { Link } from "wouter";
import {
  ArrowRight,
  Crown,
  Gem,
  Hammer,
  Mail,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";

const heritageTiles = [
  {
    title: "Gold, silver, diamond",
    copy: "A focused catalogue arranged by the materials customers already ask for.",
    image: "/assets/new/Gem (1).png",
  },
  {
    title: "Repairs and refinishing",
    copy: "Care-led jewelry services for pieces that deserve to keep their story.",
    image: "/assets/new/Gem (18).png",
  },
  {
    title: "Bespoke guidance",
    copy: "Personal assistance for gifts, bridal pieces, statement sets, and sourcing.",
    image: "/assets/new/Gem (3).png",
  },
];

const promises = [
  { icon: ShieldCheck, title: "Quality", copy: "Pieces selected and presented with confidence, clarity, and care." },
  { icon: Store, title: "Service", copy: "A shop experience prepared for merchants, sales teams, and fast customer support." },
  { icon: Sparkles, title: "Trust", copy: "A Kenyan jewelry name with a heritage story reaching back to 2000." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-border pt-36 md:pt-44">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 md:grid-cols-[0.9fr_1.1fr] md:px-8">
            <div className="flex flex-col justify-center">
              <div className="mb-8 inline-flex max-w-max flex-col items-start">
                <GemessenceLogo height={66} />
                <div className="mt-3 border-l-2 border-primary pl-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                    Royal craft. Kenyan heritage.
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold">
                    Jewellers of distinction since 2000.
                  </p>
                </div>
              </div>

              <h1 className="max-w-xl font-display text-5xl font-semibold leading-[0.98] md:text-7xl">
                Twenty five years of quiet brilliance.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground">
                Gemessence brings a royal, minimal, and trusted jewelry experience to Kenya, presenting fine pieces, timeless gifts, and customer care with the calm assurance of an established house.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/shop"
                  className="inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Shop collections <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#contact"
                  className="inline-flex h-11 items-center gap-2 rounded-sm border border-border px-6 text-sm font-semibold transition hover:border-primary hover:text-primary"
                >
                  Contact us <MessagesSquare className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[5/6] overflow-hidden rounded-sm border border-border bg-muted">
                <img
                  src={resolveImageUrl("/Gemini_Generated_Image_qkhmuyqkhmuyqkhm.png")}
                  alt="Gemessence fine jewelry"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 border border-white/25 bg-black/45 text-center text-white backdrop-blur">
                <div className="border-r border-white/20 px-3 py-4">
                  <Crown className="mx-auto mb-2 h-4 w-4 text-primary" />
                  <p className="text-[11px] uppercase tracking-[0.18em]">Since 2000</p>
                </div>
                <div className="border-r border-white/20 px-3 py-4">
                  <Gem className="mx-auto mb-2 h-4 w-4 text-primary" />
                  <p className="text-[11px] uppercase tracking-[0.18em]">Fine pieces</p>
                </div>
                <div className="px-3 py-4">
                  <Hammer className="mx-auto mb-2 h-4 w-4 text-primary" />
                  <p className="text-[11px] uppercase tracking-[0.18em]">Care & repair</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card/35 py-12">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 md:grid-cols-3 md:px-8">
            {promises.map((item) => (
              <div key={item.title} className="border border-border bg-background p-6">
                <item.icon className="mb-5 h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">The Gemessence house</p>
              <h2 className="mt-2 font-display text-4xl font-semibold">A royal welcome before the shop.</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
              Enter the shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {heritageTiles.map((tile) => (
              <Link key={tile.title} href="/shop" className="group overflow-hidden rounded-sm border border-border bg-card transition hover:border-primary/50">
                <div className="aspect-[5/4] overflow-hidden bg-muted">
                  <img
                    src={resolveImageUrl(tile.image)}
                    alt={tile.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl font-semibold">{tile.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{tile.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-card/40 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[0.8fr_1.2fr] md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Our statement</p>
              <h2 className="mt-2 font-display text-4xl font-semibold">Regal by heritage. Modern by design.</h2>
            </div>
            <div className="space-y-5 text-sm leading-8 text-muted-foreground">
              <p>
                Since 2000, Gemessence has carried the polish of an established Kenyan jeweller: considered pieces, careful service, and a catalogue made for people choosing something meaningful.
              </p>
              <p>
                The shop is now separated from the home experience, so customers can first feel the house, then browse Gold, Silver, Diamond, jewelry, and artifacts with fewer distractions.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[1fr_0.8fr] md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Reach us</p>
              <h2 className="mt-2 font-display text-4xl font-semibold">For sourcing, sizing, repairs, or payment guidance.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                The final contacts and payment details can be placed here when you share them. The structure is ready for the backend and customer communication workflow.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <a
                href="mailto:support@gemessence.co.ke"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-border bg-background px-5 text-sm font-semibold hover:border-primary hover:text-primary"
              >
                <Mail className="h-4 w-4" /> Email Gemessence
              </a>
              <a
                href="https://wa.me/254797534189"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <MessagesSquare className="h-4 w-4" /> Contact us
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 text-center md:flex-row md:px-8 md:text-left">
          <GemessenceLogo height={40} />
          <p className="text-sm text-muted-foreground">
            Gemessence, jewellers of distinction since 2000.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/shop" className="hover:text-primary">Shop</Link>
            <Link href="/admin" className="hover:text-primary">Admin</Link>
          </div>
        </div>
      </footer>

      <WhatsAppFloatingButton />
    </div>
  );
}
