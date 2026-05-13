import { Navbar } from "@/components/layout/navbar";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { GemessenceLogo } from "@/components/ui/gemessence-logo";
import { HeroSlideshow } from "@/components/ui/hero-slideshow";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { WhatsAppFloatingButton } from "@/components/ui/whatsapp-floating-button";
import { InteractiveProductCard } from "@/components/ui/interactive-product-card";
import { useProducts } from "@/hooks/use-products";
import { useState } from "react";
import { type Product } from "@shared/schema";
import { localProducts } from "@/data/products";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Diamond,
  Sparkles,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Link } from "wouter";
import footerImg from "@assets/Footer_1772877259305.png";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Home() {
  const { data: productsData, isLoading } = useProducts();
  const products = productsData as any[] | undefined;
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Featured reviews data
  const featuredReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Absolutely stunning! This necklace exceeded my expectations. The craftsmanship is incredible and it looks even better in person.",
      product: "Royal Gold Chain Necklace",
      avatar: ""
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      comment: "Beautiful bracelet with excellent build quality. The gold finish is perfect and it feels substantial. Worth every penny.",
      product: "Luxury Chain Bracelet",
      avatar: ""
    },
    {
      id: 3,
      name: "Emma Wilson",
      rating: 5,
      comment: "Perfect for special occasions. I bought this for my anniversary and it was exactly as described. Highly recommend!",
      product: "Artisan Gold Chain Set",
      avatar: ""
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-primary text-primary' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  // Enhanced product data — always use the full local collection unless the backend returns 50 or more products
  const enhancedProducts = (products && products.length > 0) ? products : localProducts;
  const displayProducts = (products && products.length >= 50) ? products : enhancedProducts;
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Slideshow */}
      <HeroSlideshow />

      {/* Value Props */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,162,39,0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(128,0,0,0.05),transparent_50%)] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-dual-accent">
              Why Choose GemEssence
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the pinnacle of luxury jewelry craftsmanship
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: Diamond,
                title: "Finest Materials",
                desc: "Ethically sourced diamonds and pure golds.",
                color: "from-primary/20 to-primary/5"
              },
              {
                icon: Sparkles,
                title: "Master Craftsmanship",
                desc: "Forged by artisans with decades of experience.",
                color: "from-secondary/20 to-secondary/5"
              },
              {
                icon: ShieldCheck,
                title: "Lifetime Warranty",
                desc: "Our commitment to quality, guaranteed forever.",
                color: "from-primary/20 to-primary/5"
              },
            ].map((prop, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group relative"
              >
                <div className="relative flex flex-col items-center text-center p-8 glass-panel rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-dual-accent flex items-center justify-center text-white mb-5 shadow-lg">
                    <prop.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2 text-dual-accent group-hover:text-primary transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {prop.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section id="collections" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">
                Curated For You
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                Featured Pieces
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">New arrivals shown first</p>
            </div>
            <Link href="/#collections" className="text-primary font-semibold flex items-center gap-2 hover:gap-4 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {isLoading
              ? // Skeletons
                Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted aspect-[4/5] rounded-2xl mb-4" />
                      <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                      <div className="h-8 bg-muted rounded w-3/4 mb-4" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </div>
                  ))
              : displayProducts.map((product) => (
                  <InteractiveProductCard
                    key={product.id}
                    product={product as any}
                    onClick={(p) => setSelectedProduct(p as any)}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gold-texture-overlay border-t border-border pt-20 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img
            src={footerImg}
            alt="Texture"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center mb-6">
              <GemessenceLogo height={38} />
            </Link>
              <p className="text-white/80 max-w-sm mb-6 leading-relaxed">
                Elevating the art of fine jewelry. We craft pieces that capture
                light, command attention, and celebrate life's most precious
                moments.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
                Explore
              </h4>
              <ul className="space-y-4 text-white/70">
                <li>
                  <Link href="/#collections" className="hover:text-primary transition-colors cursor-pointer">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/#collections" className="hover:text-primary transition-colors cursor-pointer">
                    Bestsellers
                  </Link>
                </li>
                <li>
                  <Link href="/#collections" className="hover:text-primary transition-colors cursor-pointer">
                    Bridal Collection
                  </Link>
                </li>
                <li>
                  <Link href="/#collections" className="hover:text-primary transition-colors cursor-pointer">
                    High Jewelry
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
                Assistance
              </h4>
              <ul className="space-y-4 text-white/70">
                <li>
                  <a
                    href={`https://wa.me/${encodeURIComponent("+254797534189")}?text=${encodeURIComponent("Hello! I need assistance.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${encodeURIComponent("+254797534189")}?text=${encodeURIComponent("Hi, I have a question about shipping and returns.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Shipping &amp; Returns
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${encodeURIComponent("+254797534189")}?text=${encodeURIComponent("Hi, I need jewelry care advice.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Care Guide
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${encodeURIComponent("+254797534189")}?text=${encodeURIComponent("Hi, I have a question.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/20 text-center text-sm text-white/60 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>
              &copy; {new Date().getFullYear()} Gemessence. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href={`https://wa.me/${encodeURIComponent("+254797534189")}?text=${encodeURIComponent("Hi, I have a privacy question.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href={`https://wa.me/${encodeURIComponent("+254797534189")}?text=${encodeURIComponent("Hi, I have a question about your terms.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <WhatsAppFloatingButton />

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Shared Layout Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
