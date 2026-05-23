import { Navbar } from "@/components/layout/navbar";
import { ProductModal } from "@/components/product-modal";
import { GemessenceLogo } from "@/components/ui/gemessence-logo";
import { InteractiveProductCard } from "@/components/ui/interactive-product-card";
import { WhatsAppFloatingButton } from "@/components/ui/whatsapp-floating-button";
import { useProducts } from "@/hooks/use-products";
import { resolveImageUrl } from "@/lib/utils";
import { type Product } from "@shared/schema";
import { localProducts } from "@/data/products";
import { Link } from "wouter";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Mail,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";

const materialCollections = [
  {
    id: "gold",
    title: "Gold",
    subtitle: "Yellow, white, and rose gold pieces with a warm Gemessence finish.",
    image: "/assets/Gem (1).png",
    tone: "bg-[#c9a227]",
  },
  {
    id: "silver",
    title: "Silver",
    subtitle: "Sterling silver essentials, polished for everyday elegance.",
    image: "/assets/Gem (8).png",
    tone: "bg-[#b8bec8]",
  },
  {
    id: "diamond",
    title: "Diamond",
    subtitle: "Diamond-led rings, pendants, and occasion pieces with precise sparkle.",
    image: "/assets/Gem (3).png",
    tone: "bg-[#e7eef2]",
  },
];

const shopCollections = [
  { label: "Necklaces", href: "#necklaces", image: "/assets/Gem (9).png" },
  { label: "Chains", href: "#gold", image: "/Chain Ch.00_03_33_24.Still023.jpg" },
  { label: "Rings", href: "#diamond", image: "/assets/Gem (6).png" },
  { label: "Bracelets & Bangles", href: "#bracelets", image: "/assets/Gem (5).png" },
  { label: "Earrings", href: "#earrings", image: "/assets/Gem (13).png" },
  { label: "Artifacts", href: "#artifacts", image: "/assets/Gem (25).png" },
];

function belongsToMaterial(product: Product, material: string) {
  const haystack = [
    product.name,
    product.description,
    product.category,
    product.metalType,
    product.metalColor,
    product.gemstoneType,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (material === "diamond") return haystack.includes("diamond");
  if (material === "silver") return haystack.includes("silver");
  return haystack.includes("gold") || haystack.includes("18k") || haystack.includes("14k");
}

function categoryMatches(product: Product, category: string) {
  return product.category.toLowerCase().includes(category);
}

export default function ShopPage() {
  const { data: productsData, isLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const products = (productsData && productsData.length > 0 ? productsData : localProducts) as Product[];

  const featuredProducts = useMemo(
    () => products.filter((product) => product.featured).slice(0, 8),
    [products],
  );

  const byMaterial = useMemo(
    () =>
      Object.fromEntries(
        materialCollections.map((collection) => [
          collection.id,
          products.filter((product) => belongsToMaterial(product, collection.id)).slice(0, 4),
        ]),
      ) as Record<string, Product[]>,
    [products],
  );

  const necklaceProducts = products.filter((product) => categoryMatches(product, "necklace")).slice(0, 4);
  const braceletProducts = products.filter((product) => categoryMatches(product, "bracelet")).slice(0, 4);
  const earringProducts = products.filter((product) => categoryMatches(product, "earring")).slice(0, 4);
  const artifactProducts = products
    .filter((product) => product.category.toLowerCase().includes("set") || product.name.toLowerCase().includes("bangle"))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        <section className="relative min-h-[92vh] overflow-hidden border-b border-border bg-background pt-36 md:pt-44">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 pb-16 md:grid-cols-[0.92fr_1.08fr] md:px-8">
            <div className="flex flex-col justify-center">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                Gemessence fine jewelry
              </p>
              <h1 className="max-w-xl font-display text-5xl font-semibold leading-[0.98] md:text-7xl">
                Crafted pieces for a quieter kind of luxury.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground">
                Shop the latest Gemessence gold, silver, diamond jewelry, and select artifacts through a focused catalogue arranged for clarity, speed, and future merchant operations.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="#collections"
                  className="inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Browse latest <ArrowRight className="h-4 w-4" />
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
              <div className="aspect-[4/5] overflow-hidden rounded-sm border border-border bg-muted md:aspect-[5/6]">
                <img
                  src={resolveImageUrl("/Gemini_Generated_Image_b8tezgb8tezgb8te.png")}
                  alt="Gemessence jewelry"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border border-white/25 bg-black/45 px-4 py-3 text-white backdrop-blur">
                <GemessenceLogo height={34} />
                <span className="text-xs uppercase tracking-[0.28em] text-white/80">Gold | Silver | Diamond</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card/35 py-6">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 text-sm text-muted-foreground md:grid-cols-3 md:px-8">
            <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-primary" /> Verified pieces and controlled catalogue access</div>
            <div className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-primary" /> High-quality product imagery prepared for Cloudinary</div>
            <div className="flex items-center gap-3"><Store className="h-4 w-4 text-primary" /> Merchant and sales dashboards ready for backend roles</div>
          </div>
        </section>

        <section id="collections" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Collections</p>
              <h2 className="mt-2 font-display text-4xl font-semibold">Shop by material</h2>
            </div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
              Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {materialCollections.map((collection) => (
              <a
                key={collection.id}
                href={`#${collection.id}`}
                className="group overflow-hidden rounded-sm border border-border bg-card transition hover:border-primary/50"
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-muted">
                  <img
                    src={resolveImageUrl(collection.image)}
                    alt={`${collection.title} jewelry`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className={`absolute left-4 top-4 h-3 w-3 rounded-full ${collection.tone}`} />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl font-semibold">{collection.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{collection.subtitle}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-card/35 py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="font-display text-4xl font-semibold">Jewelry and artifacts</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {shopCollections.map((collection) => (
                <a key={collection.label} href={collection.href} className="group">
                  <div className="aspect-square overflow-hidden rounded-sm border border-border bg-background">
                    <img
                      src={resolveImageUrl(collection.image)}
                      alt={collection.label}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.18em] group-hover:text-primary">
                    {collection.label}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <ProductGrid
          id="best-sellers"
          eyebrow="Best sellers"
          title="Browse our latest products"
          products={featuredProducts}
          isLoading={isLoading}
          onSelect={setSelectedProduct}
        />

        <ProductGrid
          id="all-products"
          eyebrow="Complete catalogue"
          title="All latest Gemessence pieces"
          products={products}
          onSelect={setSelectedProduct}
        />

        {materialCollections.map((collection) => (
          <ProductGrid
            key={collection.id}
            id={collection.id}
            eyebrow={`${collection.title} edit`}
            title={`${collection.title} jewelry`}
            products={byMaterial[collection.id]}
            onSelect={setSelectedProduct}
          />
        ))}

        <ProductGrid id="necklaces" eyebrow="Jewelry" title="Necklaces and chains" products={necklaceProducts} onSelect={setSelectedProduct} />
        <ProductGrid id="bracelets" eyebrow="Jewelry" title="Bracelets and bangles" products={braceletProducts} onSelect={setSelectedProduct} />
        <ProductGrid id="earrings" eyebrow="Jewelry" title="Earrings" products={earringProducts} onSelect={setSelectedProduct} />
        <ProductGrid id="artifacts" eyebrow="Artifacts" title="Statement sets and artifacts" products={artifactProducts} onSelect={setSelectedProduct} />

        <section id="contact" className="border-t border-border bg-card/50 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[1fr_0.8fr] md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Contact</p>
              <h2 className="mt-2 font-display text-4xl font-semibold">Need sizing, sourcing, or payment guidance?</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                The contact and payment details can be plugged in once you share them. For now this section is wired as a clear customer action point.
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
            © {new Date().getFullYear()} Gemessence. Fine jewelry, merchant-ready operations, and customer-first service.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/auth" className="hover:text-primary">Log in</Link>
            <Link href="/admin" className="hover:text-primary">Admin</Link>
          </div>
        </div>
      </footer>

      <WhatsAppFloatingButton />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}

function ProductGrid({
  id,
  eyebrow,
  title,
  products,
  isLoading = false,
  onSelect,
}: {
  id: string;
  eyebrow: string;
  title: string;
  products: Product[];
  isLoading?: boolean;
  onSelect: (product: Product) => void;
}) {
  if (!isLoading && products.length === 0) return null;

  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
              <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">{title}</h2>
        </div>
        <BadgePercent className="hidden h-5 w-5 text-primary md:block" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-sm border border-border bg-card">
                <div className="aspect-[4/5] bg-muted" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-24 bg-muted" />
                  <div className="h-5 w-40 bg-muted" />
                  <div className="h-4 w-20 bg-muted" />
                </div>
              </div>
            ))
          : products.map((product) => (
              <InteractiveProductCard key={product.id} product={product} onClick={(item) => onSelect(item as Product)} />
            ))}
      </div>
    </section>
  );
}
