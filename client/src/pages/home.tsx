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

  // Chain product images for new products
  const chainImages = [
    `${BASE}/assets/Gem (1).png`,
    `${BASE}/assets/Gem (2).png`,
    `${BASE}/assets/Gem (3).png`,
    `${BASE}/assets/Gem (4).png`,
    `${BASE}/assets/Gem (5).png`,
    `${BASE}/assets/Gem (6).png`,
    `${BASE}/assets/Gem (7).png`,
    `${BASE}/assets/Gem (8).png`,
    `${BASE}/assets/Gem (9).png`,
    `${BASE}/assets/Gem (10).png`,
    `${BASE}/assets/Gem (11).png`,
    `${BASE}/assets/Gem (12).png`,
  ];

  // Enhanced product data with chain images
  const enhancedProducts = (products && products.length > 0) ? products : [
    { id: 1, name: "Royal Gold Chain Necklace", slug: "royal-gold-chain-necklace", description: "Exquisite 18k gold chain with intricate link design, perfect for any occasion", price: "125000.00", compareAtPrice: "150000.00", imageUrl: chainImages[0], images: [] as string[], categoryId: null, category: "Necklaces", featured: true, inStock: true, stockQuantity: 10, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: "Luxury Chain Bracelet", slug: "luxury-chain-bracelet", description: "Premium gold bracelet with sophisticated craftsmanship and timeless appeal", price: "85000.00", compareAtPrice: null, imageUrl: chainImages[1], images: [] as string[], categoryId: null, category: "Bracelets", featured: true, inStock: true, stockQuantity: 10, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, name: "Artisan Gold Chain Set", slug: "artisan-gold-chain-set", description: "Handcrafted chain jewelry set with royal elegance and master craftsmanship", price: "195000.00", compareAtPrice: "220000.00", imageUrl: chainImages[2], images: [] as string[], categoryId: null, category: "Sets", featured: true, inStock: true, stockQuantity: 5, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, name: "Classic Chain Pendant", slug: "classic-chain-pendant", description: "Timeless gold chain with elegant pendant design for everyday luxury", price: "75000.00", compareAtPrice: null, imageUrl: chainImages[3], images: [] as string[], categoryId: null, category: "Necklaces", featured: true, inStock: true, stockQuantity: 15, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, name: "Regal Chain Collection", slug: "regal-chain-collection", description: "Sophisticated chain jewelry for special occasions and celebrations", price: "165000.00", compareAtPrice: null, imageUrl: chainImages[4], images: [] as string[], categoryId: null, category: "Rings", featured: true, inStock: true, stockQuantity: 8, sku: null, metalType: "18k Gold", metalColor: "Rose", gemstoneType: "Diamond", gemstoneWeight: null, ringSizes: ["6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 6, name: "Master Craftsman Chain", slug: "master-craftsman-chain", description: "Premium artisan chain with exceptional detail and unmatched quality", price: "145000.00", compareAtPrice: "175000.00", imageUrl: chainImages[5], images: [] as string[], categoryId: null, category: "Necklaces", featured: true, inStock: true, stockQuantity: 12, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: "20 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 7, name: "Diamond Solitaire Ring", slug: "diamond-solitaire-ring", description: "Brilliant round-cut diamond set in 18k white gold — the ultimate symbol of love", price: "285000.00", compareAtPrice: null, imageUrl: chainImages[6], images: [] as string[], categoryId: null, category: "Rings", featured: true, inStock: true, stockQuantity: 4, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Diamond", gemstoneWeight: null, ringSizes: ["5","6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 8, name: "Pearl Drop Earrings", slug: "pearl-drop-earrings", description: "Elegant freshwater pearl drop earrings set in sterling silver for refined grace", price: "45000.00", compareAtPrice: null, imageUrl: chainImages[7], images: [] as string[], categoryId: null, category: "Earrings", featured: false, inStock: true, stockQuantity: 20, sku: null, metalType: "Sterling Silver", metalColor: "White", gemstoneType: "Pearl", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 9, name: "Gold Tennis Bracelet", slug: "gold-tennis-bracelet", description: "Stunning tennis bracelet featuring genuine gemstones set in 14k gold", price: "95000.00", compareAtPrice: "115000.00", imageUrl: chainImages[8], images: [] as string[], categoryId: null, category: "Bracelets", featured: false, inStock: true, stockQuantity: 7, sku: null, metalType: "14k Gold", metalColor: "Yellow", gemstoneType: "Ruby", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 10, name: "Sapphire Halo Ring", slug: "sapphire-halo-ring", description: "Magnificent blue sapphire surrounded by a halo of diamonds in platinum", price: "175000.00", compareAtPrice: null, imageUrl: chainImages[9], images: [] as string[], categoryId: null, category: "Rings", featured: false, inStock: true, stockQuantity: 3, sku: null, metalType: "Platinum", metalColor: "White", gemstoneType: "Sapphire", gemstoneWeight: null, ringSizes: ["5","6","7"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 11, name: "Rose Gold Bangle", slug: "rose-gold-bangle", description: "Delicate rose gold bangle with intricate floral engravings — feminine and timeless", price: "65000.00", compareAtPrice: null, imageUrl: chainImages[10], images: [] as string[], categoryId: null, category: "Bracelets", featured: false, inStock: true, stockQuantity: 14, sku: null, metalType: "18k Gold", metalColor: "Rose", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 12, name: "Emerald Cut Diamond Ring", slug: "emerald-cut-diamond-ring", description: "Sophisticated emerald-cut diamond with baguette side stones in 18k white gold", price: "225000.00", compareAtPrice: "260000.00", imageUrl: chainImages[11], images: [] as string[], categoryId: null, category: "Rings", featured: false, inStock: true, stockQuantity: 2, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Diamond", gemstoneWeight: null, ringSizes: ["5","6","7","8","9"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
  ] as Product[];

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
            </div>
            <button className="text-primary font-semibold flex items-center gap-2 hover:gap-4 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </button>
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
              : enhancedProducts?.map((product) => (
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
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Shipping & Returns
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Care Guide
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    FAQ
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/20 text-center text-sm text-white/60 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>
              &copy; {new Date().getFullYear()} Gemessence. All rights reserved.
            </p>
            <div className="flex gap-6">
              <span className="hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Terms of Service
              </span>
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
