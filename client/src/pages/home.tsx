import { Navbar } from "@/components/layout/navbar";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { useProducts } from "@/hooks/use-products";
import { useState } from "react";
import { type Product } from "@shared/schema";
import { motion } from "framer-motion";
import { ChevronRight, Diamond, Sparkles, ShieldCheck, Gem } from "lucide-react";
import { Link } from "wouter";
import heroImg from "@assets/Hero_1772877259305.png";
import footerImg from "@assets/Footer_1772877259305.png";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fallback realistic data if API is empty/loading
  const displayProducts = products?.length ? products : Array(6).fill({
    id: 0,
    name: "Loading Masterpiece...",
    description: "Please wait while we unearth our finest collection.",
    price: "0.00",
    imageUrl: "",
    category: "Collection",
    featured: false,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background Fallback to Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" /> {/* Dark wash for text contrast */}
          <img 
            src={heroImg} 
            alt="GemEssence Hero" 
            className="w-full h-full object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          />
          {/* If you have a real video URL, use this instead:
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="YOUR_VIDEO_URL.mp4" type="video/mp4" />
          </video>
          */}
        </div>

        <div className="container relative z-20 mx-auto px-4 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm md:text-base mb-6 block">
              Modern Opulence
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Discover Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-primary">
                True Brilliance
              </span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl font-light mb-10">
              Curated collections of exquisite jewelry designed to elevate your everyday and immortalize your finest moments.
            </p>
            <Link href="#collections">
              <button className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 gold-glow-hover flex items-center gap-2 mx-auto transition-all">
                Explore Collection <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
          <span className="text-white/60 text-xs uppercase tracking-widest mb-2">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Diamond, title: "Finest Materials", desc: "Ethically sourced diamonds and pure golds." },
              { icon: Sparkles, title: "Master Craftsmanship", desc: "Forged by artisans with decades of experience." },
              { icon: ShieldCheck, title: "Lifetime Warranty", desc: "Our commitment to quality, guaranteed forever." }
            ].map((prop, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <prop.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{prop.title}</h3>
                <p className="text-muted-foreground">{prop.desc}</p>
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
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Curated For You</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">Featured Pieces</h2>
            </div>
            <button className="text-primary font-semibold flex items-center gap-2 hover:gap-4 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {isLoading ? (
              // Skeletons
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted aspect-[4/5] rounded-2xl mb-4" />
                  <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-8 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              ))
            ) : (
              displayProducts?.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product as Product} 
                  onClick={setSelectedProduct} 
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-card border-t border-border pt-20 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img src={footerImg} alt="Texture" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Gem className="w-4 h-4" />
                </div>
                <span className="font-display text-2xl font-bold tracking-wider text-foreground">
                  GemEssence
                </span>
              </Link>
              <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
                Elevating the art of fine jewelry. We craft pieces that capture light, command attention, and celebrate life's most precious moments.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Explore</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Bestsellers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Bridal Collection</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">High Jewelry</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Assistance</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Care Guide</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} GemEssence. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Shared Layout Modal */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}
