import { useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/use-products";
import { useCartContext } from "@/hooks/use-cart-context";
import { useCurrency } from "@/hooks/use-currency";
import { useToast } from "@/hooks/use-toast";
import { ProductModal } from "@/components/product-modal";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Product } from "@shared/schema";

export default function ProductDetailPage() {
  const [, params] = useRoute("/product/:slug");
  const [, setLocation] = useLocation();
  const { data: products } = useProducts();
  const { addItem } = useCartContext();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const slug = params?.slug;
  const product = products?.find((p: any) => p.slug === slug) as any;

  // Related products (same category, different product)
  const relatedProducts = products
    ?.filter((p: any) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4) || [];

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Product not found</h1>
            <Button onClick={() => setLocation("/")}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const images = [product.imageUrl, ...(product.images || [])];
  const price = parseFloat(product.price);
  const comparePrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : null;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  const rating = product.averageRating || 4.5;
  const reviewCount = product.reviewCount || 0;

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price, imageUrl: product.imageUrl, category: product.category, slug: product.slug }, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
    toast({ title: "Added to cart!", description: `${qty}× ${product.name}` });
  };

  const nextImage = () => setActiveImg((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveImg((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-20 pb-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/#collections" className="hover:text-primary transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      i === activeImg ? "border-primary" : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Back button (mobile) */}
            <button
              onClick={() => setLocation("/")}
              className="lg:hidden flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/90 text-primary-foreground">{product.category}</Badge>
              {discount > 0 && (
                <Badge className="bg-secondary text-secondary-foreground">-{discount}% OFF</Badge>
              )}
              {product.inStock === false && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
              {product.featured && (
                <Badge variant="outline" className="border-primary/50 text-primary">Featured</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating) ? "fill-primary text-primary" : "text-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              {comparePrice && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compareAtPrice!)}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Product Specs */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-xl">
              {product.metalType && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Metal</p>
                  <p className="font-semibold text-sm">{product.metalType}{product.metalColor ? ` (${product.metalColor})` : ""}</p>
                </div>
              )}
              {product.gemstoneType && product.gemstoneType !== "None" && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Gemstone</p>
                  <p className="font-semibold text-sm">{product.gemstoneType}{product.gemstoneWeight ? ` (${product.gemstoneWeight}ct)` : ""}</p>
                </div>
              )}
              {product.chainLength && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Length</p>
                  <p className="font-semibold text-sm">{product.chainLength}</p>
                </div>
              )}
              {product.weight && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Weight</p>
                  <p className="font-semibold text-sm">{product.weight}g</p>
                </div>
              )}
              {product.ringSizes && product.ringSizes.length > 0 && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Available Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {product.ringSizes.map((size: string) => (
                      <span key={size} className="px-3 py-1 bg-card border border-border rounded-full text-xs font-medium">{size}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Quantity</span>
              <div className="flex items-center gap-3 border border-border rounded-full px-4 py-2">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-6 w-6 flex items-center justify-center hover:text-primary transition-colors text-lg">−</button>
                <span className="w-8 text-center font-bold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="h-6 w-6 flex items-center justify-center hover:text-primary transition-colors text-lg">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                className={`flex-1 h-14 text-base font-semibold rounded-xl transition-all ${
                  justAdded ? "bg-green-600 hover:bg-green-700 text-white" : "gold-glow-hover"
                }`}
                onClick={handleAddToCart}
                disabled={product.inStock === false}
              >
                {justAdded ? (
                  <><Check className="w-5 h-5 mr-2" /> Added to Cart!</>
                ) : (
                  <><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart — {formatPrice(String(price * qty))}</>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`h-14 w-14 rounded-xl border-border ${isWishlisted ? "text-red-500 border-red-500/50" : ""}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500" : ""}`} />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Orders over KES 5,000" },
                { icon: Shield, label: "Lifetime Warranty", sub: "Quality guaranteed" },
                { icon: RotateCcw, label: "30-Day Returns", sub: "Hassle-free" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/50">
                  <t.icon className="h-5 w-5 text-primary mb-2" />
                  <p className="text-xs font-semibold">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p: any) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-3">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="font-display text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                  <p className="text-primary font-semibold text-sm">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <ProductModal product={showModal ? product as any : null} onClose={() => setShowModal(false)} />
    </div>
  );
}
