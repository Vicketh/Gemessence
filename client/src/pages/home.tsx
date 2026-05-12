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

  // New product images (from 'Gemessence new products' folder)
  const newImgs = Array.from({ length: 12 }, (_, i) => `${BASE}/assets/new/Gem (${i + 1}).png`);
  // Existing chain images
  const chainImages = Array.from({ length: 12 }, (_, i) => `${BASE}/assets/Gem (${i + 1}).png`);

  // Enhanced product data — new products appear FIRST
  const enhancedProducts = (products && products.length > 0) ? products : [
    // ── NEW ARRIVALS (appear first) ──
    { id: 101, name: "Sovereign Curb Chain Necklace", slug: "sovereign-curb-chain-necklace", description: "Bold 18k gold curb-link chain with a weighty, polished finish — a statement of power and prestige", price: "185000.00", compareAtPrice: "220000.00", imageUrl: newImgs[0], images: [] as string[], categoryId: null, category: "Necklaces", featured: true, inStock: true, stockQuantity: 8, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: "22 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 102, name: "Empress Rope Bracelet", slug: "empress-rope-bracelet", description: "Twisted rope-design bracelet in 18k yellow gold — effortlessly elegant for day or evening wear", price: "95000.00", compareAtPrice: null, imageUrl: newImgs[1], images: [] as string[], categoryId: null, category: "Bracelets", featured: true, inStock: true, stockQuantity: 12, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 103, name: "Lumière Diamond Pendant", slug: "lumiere-diamond-pendant", description: "Brilliant-cut diamond solitaire pendant on a delicate 18k white gold chain — pure radiance", price: "245000.00", compareAtPrice: "285000.00", imageUrl: newImgs[2], images: [] as string[], categoryId: null, category: "Necklaces", featured: true, inStock: true, stockQuantity: 5, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Diamond", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 104, name: "Regal Figaro Chain", slug: "regal-figaro-chain", description: "Classic figaro-link chain in 18k gold — a timeless Kenyan favourite reimagined with modern polish", price: "135000.00", compareAtPrice: null, imageUrl: newImgs[3], images: [] as string[], categoryId: null, category: "Necklaces", featured: true, inStock: true, stockQuantity: 10, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: "20 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 105, name: "Auric Bangle Set", slug: "auric-bangle-set", description: "Set of three stackable 18k gold bangles — wear together for drama or alone for understated luxury", price: "155000.00", compareAtPrice: "180000.00", imageUrl: newImgs[4], images: [] as string[], categoryId: null, category: "Bracelets", featured: true, inStock: true, stockQuantity: 7, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 106, name: "Celestia Ruby Ring", slug: "celestia-ruby-ring", description: "Vivid Mozambique ruby flanked by pavé diamonds in 18k rose gold — passion captured in metal", price: "215000.00", compareAtPrice: null, imageUrl: newImgs[5], images: [] as string[], categoryId: null, category: "Rings", featured: true, inStock: true, stockQuantity: 4, sku: null, metalType: "18k Gold", metalColor: "Rose", gemstoneType: "Ruby", gemstoneWeight: null, ringSizes: ["5","6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 107, name: "Opulence Link Bracelet", slug: "opulence-link-bracelet", description: "Heavy-gauge rectangular link bracelet in 18k gold — bold, architectural, unmistakably luxurious", price: "175000.00", compareAtPrice: "205000.00", imageUrl: newImgs[6], images: [] as string[], categoryId: null, category: "Bracelets", featured: true, inStock: true, stockQuantity: 6, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 108, name: "Soleil Hoop Earrings", slug: "soleil-hoop-earrings", description: "Oversized 18k gold hoops with a brushed-satin finish — the perfect everyday luxury accessory", price: "85000.00", compareAtPrice: null, imageUrl: newImgs[7], images: [] as string[], categoryId: null, category: "Earrings", featured: true, inStock: true, stockQuantity: 15, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 109, name: "Prestige Tennis Necklace", slug: "prestige-tennis-necklace", description: "Continuous row of round brilliant diamonds set in 18k white gold — the ultimate red-carpet piece", price: "385000.00", compareAtPrice: "450000.00", imageUrl: newImgs[8], images: [] as string[], categoryId: null, category: "Necklaces", featured: true, inStock: true, stockQuantity: 3, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Diamond", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "16 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 110, name: "Verdant Emerald Pendant", slug: "verdant-emerald-pendant", description: "Pear-cut Colombian emerald pendant on an 18k yellow gold chain — vivid colour, timeless form", price: "195000.00", compareAtPrice: null, imageUrl: newImgs[9], images: [] as string[], categoryId: null, category: "Necklaces", featured: false, inStock: true, stockQuantity: 5, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Emerald", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 111, name: "Monarch Sapphire Ring", slug: "monarch-sapphire-ring", description: "Royal blue sapphire in a classic four-claw platinum setting with diamond shoulders — regal and refined", price: "265000.00", compareAtPrice: "310000.00", imageUrl: newImgs[10], images: [] as string[], categoryId: null, category: "Rings", featured: false, inStock: true, stockQuantity: 4, sku: null, metalType: "Platinum", metalColor: "White", gemstoneType: "Sapphire", gemstoneWeight: null, ringSizes: ["5","6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 112, name: "Cascade Diamond Earrings", slug: "cascade-diamond-earrings", description: "Three-tier drop earrings with graduating diamonds in 18k white gold — movement, light, and glamour", price: "225000.00", compareAtPrice: null, imageUrl: newImgs[11], images: [] as string[], categoryId: null, category: "Earrings", featured: false, inStock: true, stockQuantity: 6, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Diamond", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    // ── EXISTING COLLECTION ──
    { id: 1, name: "Royal Gold Chain Necklace", slug: "royal-gold-chain-necklace", description: "Exquisite 18k gold chain with intricate link design, perfect for any occasion", price: "125000.00", compareAtPrice: "150000.00", imageUrl: chainImages[0], images: [] as string[], categoryId: null, category: "Necklaces", featured: true, inStock: true, stockQuantity: 10, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: "Luxury Chain Bracelet", slug: "luxury-chain-bracelet", description: "Premium gold bracelet with sophisticated craftsmanship and timeless appeal", price: "85000.00", compareAtPrice: null, imageUrl: chainImages[1], images: [] as string[], categoryId: null, category: "Bracelets", featured: true, inStock: true, stockQuantity: 10, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, name: "Artisan Gold Chain Set", slug: "artisan-gold-chain-set", description: "Handcrafted chain jewelry set with royal elegance and master craftsmanship", price: "195000.00", compareAtPrice: "220000.00", imageUrl: chainImages[2], images: [] as string[], categoryId: null, category: "Sets", featured: true, inStock: true, stockQuantity: 5, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, name: "Classic Chain Pendant", slug: "classic-chain-pendant", description: "Timeless gold chain with elegant pendant design for everyday luxury", price: "75000.00", compareAtPrice: null, imageUrl: chainImages[3], images: [] as string[], categoryId: null, category: "Necklaces", featured: true, inStock: true, stockQuantity: 15, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, name: "Regal Chain Collection", slug: "regal-chain-collection", description: "Sophisticated chain jewelry for special occasions and celebrations", price: "165000.00", compareAtPrice: null, imageUrl: chainImages[4], images: [] as string[], categoryId: null, category: "Rings", featured: true, inStock: true, stockQuantity: 8, sku: null, metalType: "18k Gold", metalColor: "Rose", gemstoneType: "Diamond", gemstoneWeight: null, ringSizes: ["6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 6, name: "Master Craftsman Chain", slug: "master-craftsman-chain", description: "Premium artisan chain with exceptional detail and unmatched quality", price: "145000.00", compareAtPrice: "175000.00", imageUrl: chainImages[5], images: [] as string[], categoryId: null, category: "Necklaces", featured: true, inStock: true, stockQuantity: 12, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: "20 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 7, name: "Ethereal Pearl Earrings", slug: "ethereal-pearl-earrings", description: "South Sea pearls set in 18k white gold with diamond studs — understated elegance", price: "165000.00", compareAtPrice: "195000.00", imageUrl: chainImages[6], images: [] as string[], categoryId: null, category: "Earrings", featured: false, inStock: true, stockQuantity: 8, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Pearl", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 8, name: "Platinum Elegance Ring", slug: "platinum-elegance-ring", description: "Minimalist platinum band with subtle diamond accents — refined sophistication", price: "125000.00", compareAtPrice: null, imageUrl: chainImages[7], images: [] as string[], categoryId: null, category: "Rings", featured: false, inStock: true, stockQuantity: 6, sku: null, metalType: "Platinum", metalColor: "White", gemstoneType: "Diamond", gemstoneWeight: null, ringSizes: ["5","6","7","8","9"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 9, name: "Sunset Amber Pendant", slug: "sunset-amber-pendant", description: "Baltic amber in an 18k gold filigree setting with chain — warm vintage appeal", price: "65000.00", compareAtPrice: null, imageUrl: chainImages[8], images: [] as string[], categoryId: null, category: "Necklaces", featured: false, inStock: true, stockQuantity: 10, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Amber", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 10, name: "Vintage Rose Gold Bangle", slug: "vintage-rose-gold-bangle", description: "18k rose gold bangle with engraved details — a treasured heirloom style", price: "105000.00", compareAtPrice: "125000.00", imageUrl: chainImages[9], images: [] as string[], categoryId: null, category: "Bracelets", featured: false, inStock: true, stockQuantity: 7, sku: null, metalType: "18k Gold", metalColor: "Rose", gemstoneType: null, gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 11, name: "Diamond Infinity Brooch", slug: "diamond-infinity-brooch", description: "18k gold brooch with infinity symbol studded with brilliant diamonds — timeless symbol", price: "175000.00", compareAtPrice: null, imageUrl: chainImages[10], images: [] as string[], categoryId: null, category: "Brooches", featured: false, inStock: true, stockQuantity: 4, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Diamond", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 12, name: "Classic Stud Earrings", slug: "classic-stud-earrings", description: "4-carat diamond studs in platinum — the ultimate everyday luxury", price: "315000.00", compareAtPrice: "360000.00", imageUrl: chainImages[11], images: [] as string[], categoryId: null, category: "Earrings", featured: true, inStock: true, stockQuantity: 3, sku: null, metalType: "Platinum", metalColor: "White", gemstoneType: "Diamond", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 13, name: "Moonlight Opal Ring", slug: "moonlight-opal-ring", description: "Fiery Ethiopian opal set in 18k yellow gold with diamond accents — mystical beauty", price: "145000.00", compareAtPrice: null, imageUrl: chainImages[0], images: [] as string[], categoryId: null, category: "Rings", featured: false, inStock: true, stockQuantity: 5, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Opal", gemstoneWeight: null, ringSizes: ["6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 14, name: "Celestial Chain Necklace", slug: "celestial-chain-necklace", description: "18k gold chain with star pendant accented with sapphires — reach for the stars", price: "115000.00", compareAtPrice: "135000.00", imageUrl: chainImages[1], images: [] as string[], categoryId: null, category: "Necklaces", featured: false, inStock: true, stockQuantity: 9, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Sapphire", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "16 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 15, name: "Fortune Jade Bracelet", slug: "fortune-jade-bracelet", description: "Grade-A jade bangle set in 18k yellow gold — symbol of prosperity and grace", price: "95000.00", compareAtPrice: null, imageUrl: chainImages[2], images: [] as string[], categoryId: null, category: "Bracelets", featured: false, inStock: true, stockQuantity: 11, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Jade", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 16, name: "Harmony Pearl Necklace", slug: "harmony-pearl-necklace", description: "Graduated Tahitian pearl necklace with 18k white gold clasp — serene sophistication", price: "205000.00", compareAtPrice: "245000.00", imageUrl: chainImages[3], images: [] as string[], categoryId: null, category: "Necklaces", featured: true, inStock: true, stockQuantity: 4, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Pearl", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 17, name: "Phoenix Fire Ring", slug: "phoenix-fire-ring", description: "18k rose gold ring with citrine and diamond phoenix design — rebirth and renewal", price: "185000.00", compareAtPrice: null, imageUrl: chainImages[4], images: [] as string[], categoryId: null, category: "Rings", featured: false, inStock: true, stockQuantity: 5, sku: null, metalType: "18k Gold", metalColor: "Rose", gemstoneType: "Citrine", gemstoneWeight: null, ringSizes: ["5","6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 18, name: "Twilight Tanzanite Set", slug: "twilight-tanzanite-set", description: "Matching tanzanite earrings and necklace in 18k white gold — rare and enchanting", price: "225000.00", compareAtPrice: "265000.00", imageUrl: chainImages[5], images: [] as string[], categoryId: null, category: "Sets", featured: false, inStock: true, stockQuantity: 3, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Tanzanite", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 19, name: "Crown Jewels Tiara", slug: "crown-jewels-tiara", description: "Stunning tiara with mixed gemstones in 18k gold — fit for royalty", price: "385000.00", compareAtPrice: "450000.00", imageUrl: chainImages[6], images: [] as string[], categoryId: null, category: "Tiaras", featured: false, inStock: true, stockQuantity: 2, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Mixed", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 20, name: "Amethyst Mystique Pendant", slug: "amethyst-mystique-pendant", description: "Deep amethyst on 18k white gold with diamond surround — spiritual elegance", price: "135000.00", compareAtPrice: null, imageUrl: chainImages[7], images: [] as string[], categoryId: null, category: "Necklaces", featured: false, inStock: true, stockQuantity: 8, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Amethyst", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 21, name: "Golden Halo Ring", slug: "golden-halo-ring", description: "Cushion diamond surrounded by 18k yellow gold halo — classic engagement style", price: "295000.00", compareAtPrice: "340000.00", imageUrl: chainImages[8], images: [] as string[], categoryId: null, category: "Rings", featured: true, inStock: true, stockQuantity: 4, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Diamond", gemstoneWeight: null, ringSizes: ["5","6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 22, name: "Sapphire Dreams Brooch", slug: "sapphire-dreams-brooch", description: "Ornate brooch with blue sapphires and diamonds in 18k gold — vintage glamour", price: "155000.00", compareAtPrice: null, imageUrl: chainImages[9], images: [] as string[], categoryId: null, category: "Brooches", featured: false, inStock: true, stockQuantity: 5, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Sapphire", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 23, name: "Aquamarine Waters Necklace", slug: "aquamarine-waters-necklace", description: "Oval aquamarine pendant with 18k white gold chain — serene ocean vibes", price: "175000.00", compareAtPrice: "205000.00", imageUrl: chainImages[10], images: [] as string[], categoryId: null, category: "Necklaces", featured: false, inStock: true, stockQuantity: 6, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Aquamarine", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 24, name: "Peridot Sunshine Earrings", slug: "peridot-sunshine-earrings", description: "Bright peridot drops in 18k yellow gold with diamond posts — cheerful luxury", price: "95000.00", compareAtPrice: null, imageUrl: chainImages[11], images: [] as string[], categoryId: null, category: "Earrings", featured: false, inStock: true, stockQuantity: 10, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Peridot", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 25, name: "Garnet Passion Ring", slug: "garnet-passion-ring", description: "Deep red garnet in 18k rose gold with diamond shoulders — dramatic and sultry", price: "125000.00", compareAtPrice: null, imageUrl: chainImages[0], images: [] as string[], categoryId: null, category: "Rings", featured: false, inStock: true, stockQuantity: 6, sku: null, metalType: "18k Gold", metalColor: "Rose", gemstoneType: "Garnet", gemstoneWeight: null, ringSizes: ["6","7","8","9"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 26, name: "Topaz Royalty Pendant", slug: "topaz-royalty-pendant", description: "Swiss blue topaz on 18k white gold with diamond halo — precious radiance", price: "145000.00", compareAtPrice: "175000.00", imageUrl: chainImages[1], images: [] as string[], categoryId: null, category: "Necklaces", featured: false, inStock: true, stockQuantity: 7, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Topaz", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 27, name: "Turquoise Tranquility Bracelet", slug: "turquoise-tranquility-bracelet", description: "Sleeping Beauty turquoise stones in 18k gold links — bohemian chic", price: "85000.00", compareAtPrice: null, imageUrl: chainImages[2], images: [] as string[], categoryId: null, category: "Bracelets", featured: false, inStock: true, stockQuantity: 9, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Turquoise", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 28, name: "Moonstone Mystique Ring", slug: "moonstone-mystique-ring", description: "Rainbow moonstone in 18k white gold with diamond accents — ethereal beauty", price: "115000.00", compareAtPrice: null, imageUrl: chainImages[3], images: [] as string[], categoryId: null, category: "Rings", featured: false, inStock: true, stockQuantity: 5, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Moonstone", gemstoneWeight: null, ringSizes: ["5","6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 29, name: "Tourmaline Bicolor Necklace", slug: "tourmaline-bicolor-necklace", description: "Stunning bicolor tourmaline pendant on 18k gold chain — nature's masterpiece", price: "165000.00", compareAtPrice: "195000.00", imageUrl: chainImages[4], images: [] as string[], categoryId: null, category: "Necklaces", featured: false, inStock: true, stockQuantity: 4, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Tourmaline", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 30, name: "Spinel Sparkle Earrings", slug: "spinel-sparkle-earrings", description: "Vibrant red spinel studs in 18k white gold — rare and radiant", price: "125000.00", compareAtPrice: null, imageUrl: chainImages[5], images: [] as string[], categoryId: null, category: "Earrings", featured: false, inStock: true, stockQuantity: 7, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Spinel", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 31, name: "Citrine Bliss Ring", slug: "citrine-bliss-ring", description: "Golden citrine on 18k yellow gold with diamond surround — happiness captured", price: "95000.00", compareAtPrice: null, imageUrl: chainImages[6], images: [] as string[], categoryId: null, category: "Rings", featured: false, inStock: true, stockQuantity: 8, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Citrine", gemstoneWeight: null, ringSizes: ["5","6","7","8","9"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 32, name: "Alexandrite Wonder Pendant", slug: "alexandrite-wonder-pendant", description: "Color-changing alexandrite on 18k white gold — the ultimate conversation piece", price: "205000.00", compareAtPrice: "245000.00", imageUrl: chainImages[7], images: [] as string[], categoryId: null, category: "Necklaces", featured: true, inStock: true, stockQuantity: 3, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Alexandrite", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 33, name: "Kunzite Romance Bracelet", slug: "kunzite-romance-bracelet", description: "Soft pink kunzite stones in 18k rose gold — delicate femininity", price: "135000.00", compareAtPrice: null, imageUrl: chainImages[8], images: [] as string[], categoryId: null, category: "Bracelets", featured: false, inStock: true, stockQuantity: 6, sku: null, metalType: "18k Gold", metalColor: "Rose", gemstoneType: "Kunzite", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 34, name: "Morganite Blush Ring", slug: "morganite-blush-ring", description: "Peach morganite in 18k rose gold with diamond accents — feminine elegance", price: "155000.00", compareAtPrice: null, imageUrl: chainImages[9], images: [] as string[], categoryId: null, category: "Rings", featured: true, inStock: true, stockQuantity: 5, sku: null, metalType: "18k Gold", metalColor: "Rose", gemstoneType: "Morganite", gemstoneWeight: null, ringSizes: ["5","6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 35, name: "Tourmaline Watermelon Set", slug: "tourmaline-watermelon-set", description: "Matching earrings and pendant with watermelon tourmaline in 18k gold — tropical luxury", price: "245000.00", compareAtPrice: "285000.00", imageUrl: chainImages[10], images: [] as string[], categoryId: null, category: "Sets", featured: false, inStock: true, stockQuantity: 3, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Tourmaline", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 36, name: "Tanzanite Twilight Earrings", slug: "tanzanite-twilight-earrings", description: "Exquisite tanzanite drops in platinum — rare African jewels", price: "185000.00", compareAtPrice: null, imageUrl: chainImages[11], images: [] as string[], categoryId: null, category: "Earrings", featured: false, inStock: true, stockQuantity: 4, sku: null, metalType: "Platinum", metalColor: "White", gemstoneType: "Tanzanite", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 37, name: "Heliodor Sunshine Necklace", slug: "heliodor-sunshine-necklace", description: "Golden heliodor on 18k yellow gold chain — radiant warmth", price: "115000.00", compareAtPrice: null, imageUrl: chainImages[0], images: [] as string[], categoryId: null, category: "Necklaces", featured: false, inStock: true, stockQuantity: 7, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Heliodor", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 38, name: "Tourmaline Pink Ring", slug: "tourmaline-pink-ring", description: "Pink tourmaline in 18k rose gold with diamond halo — romantic sophistication", price: "175000.00", compareAtPrice: "205000.00", imageUrl: chainImages[1], images: [] as string[], categoryId: null, category: "Rings", featured: false, inStock: true, stockQuantity: 5, sku: null, metalType: "18k Gold", metalColor: "Rose", gemstoneType: "Tourmaline", gemstoneWeight: null, ringSizes: ["5","6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 39, name: "Quartz Smoke Pendant", slug: "quartz-smoke-pendant", description: "Smoky quartz on 18k white gold — earthy sophistication", price: "65000.00", compareAtPrice: null, imageUrl: chainImages[2], images: [] as string[], categoryId: null, category: "Necklaces", featured: false, inStock: true, stockQuantity: 12, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Smoky Quartz", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 40, name: "Rose Quartz Gentle Bracelet", slug: "rose-quartz-gentle-bracelet", description: "Rose quartz beads in 18k gold links — love and compassion", price: "75000.00", compareAtPrice: null, imageUrl: chainImages[3], images: [] as string[], categoryId: null, category: "Bracelets", featured: false, inStock: true, stockQuantity: 11, sku: null, metalType: "18k Gold", metalColor: "Rose", gemstoneType: "Rose Quartz", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 41, name: "Crystal Cluster Ring", slug: "crystal-cluster-ring", description: "Clear quartz cluster on 18k yellow gold — natural architecture", price: "105000.00", compareAtPrice: null, imageUrl: chainImages[4], images: [] as string[], categoryId: null, category: "Rings", featured: false, inStock: true, stockQuantity: 6, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Quartz", gemstoneWeight: null, ringSizes: ["6","7","8","9"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 42, name: "Iolite Indigo Earrings", slug: "iolite-indigo-earrings", description: "Vivid iolite studs in 18k white gold — rare blue beauty", price: "95000.00", compareAtPrice: null, imageUrl: chainImages[5], images: [] as string[], categoryId: null, category: "Earrings", featured: false, inStock: true, stockQuantity: 8, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Iolite", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 43, name: "Rhodolite Garnet Pendant", slug: "rhodolite-garnet-pendant", description: "Purple-red rhodolite on 18k yellow gold — precious gem", price: "145000.00", compareAtPrice: null, imageUrl: chainImages[6], images: [] as string[], categoryId: null, category: "Necklaces", featured: false, inStock: true, stockQuantity: 5, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Rhodolite", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 44, name: "Sphene Fire Ring", slug: "sphene-fire-ring", description: "Yellow-green sphene in 18k gold with diamonds — brilliant sparkle", price: "125000.00", compareAtPrice: null, imageUrl: chainImages[7], images: [] as string[], categoryId: null, category: "Rings", featured: false, inStock: true, stockQuantity: 4, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Sphene", gemstoneWeight: null, ringSizes: ["5","6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 45, name: "Zircon Dream Necklace", slug: "zircon-dream-necklace", description: "Blue zircon on 18k white gold chain — ethereal glow", price: "135000.00", compareAtPrice: "165000.00", imageUrl: chainImages[8], images: [] as string[], categoryId: null, category: "Necklaces", featured: false, inStock: true, stockQuantity: 6, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Zircon", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 46, name: "Tanzanite Mystical Bracelet", slug: "tanzanite-mystical-bracelet", description: "Tanzanite stone bracelet in 18k gold — rare and exclusive", price: "165000.00", compareAtPrice: "195000.00", imageUrl: chainImages[9], images: [] as string[], categoryId: null, category: "Bracelets", featured: true, inStock: true, stockQuantity: 3, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Tanzanite", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 47, name: "Chrysoberyl Honey Ring", slug: "chrysoberyl-honey-ring", description: "Golden chrysoberyl on 18k yellow gold — warm and luxurious", price: "145000.00", compareAtPrice: null, imageUrl: chainImages[10], images: [] as string[], categoryId: null, category: "Rings", featured: false, inStock: true, stockQuantity: 5, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Chrysoberyl", gemstoneWeight: null, ringSizes: ["6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 48, name: "Apatite Ocean Earrings", slug: "apatite-ocean-earrings", description: "Vivid blue apatite in 18k white gold posts — oceanic allure", price: "105000.00", compareAtPrice: null, imageUrl: chainImages[11], images: [] as string[], categoryId: null, category: "Earrings", featured: false, inStock: true, stockQuantity: 8, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Apatite", gemstoneWeight: null, ringSizes: [] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 49, name: "Beryl Aqua Pendant", slug: "beryl-aqua-pendant", description: "Light blue aqua beryl on 18k white gold — refreshing elegance", price: "125000.00", compareAtPrice: null, imageUrl: chainImages[0], images: [] as string[], categoryId: null, category: "Necklaces", featured: false, inStock: true, stockQuantity: 7, sku: null, metalType: "18k Gold", metalColor: "White", gemstoneType: "Beryl", gemstoneWeight: null, ringSizes: [] as string[], chainLength: "18 inches", weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 50, name: "Grand Finale Crown Ring", slug: "grand-finale-crown-ring", description: "Magnificent 18k gold ring with multi-gemstone crown setting — ultimate statement piece", price: "275000.00", compareAtPrice: "325000.00", imageUrl: chainImages[1], images: [] as string[], categoryId: null, category: "Rings", featured: true, inStock: true, stockQuantity: 2, sku: null, metalType: "18k Gold", metalColor: "Yellow", gemstoneType: "Mixed", gemstoneWeight: null, ringSizes: ["5","6","7","8"] as string[], chainLength: null, weight: null, dimensions: null, createdAt: new Date(), updatedAt: new Date() },
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
