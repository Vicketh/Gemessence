import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Heart, Star, Shield, Truck, RotateCcw, Check, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartContext } from "@/hooks/use-cart-context";
import { useCurrency } from "@/hooks/use-currency";
import { useToast } from "@/hooks/use-toast";
import type { ProductCardData } from "@/components/ui/interactive-product-card";

interface ProductModalProps {
  product: ProductCardData | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [activeImg, setActiveImg] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, isInCart } = useCartContext();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();

  if (!product) return null;

  const images = [product.imageUrl].filter(Boolean);
  const inCart = isInCart(product.id);
  const price = parseFloat(product.price);
  const comparePrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : null;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;
  const rating = product.averageRating ?? 4.8;
  const reviewCount = product.reviewCount ?? 0;

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price, imageUrl: product.imageUrl, category: product.category, slug: product.slug }, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
    toast({ title: "Added to cart!", description: `${qty}× ${product.name}` });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-card rounded-3xl overflow-hidden shadow-2xl border border-border flex flex-col md:flex-row z-10 max-h-[92vh]"
        >
          {/* Close */}
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 z-20 rounded-full bg-background/60 hover:bg-background backdrop-blur-md">
            <X className="w-5 h-5" />
          </Button>

          {/* Image Section */}
          <div className="w-full md:w-[52%] flex flex-col bg-muted/30">
            <div className="relative flex-1 min-h-[300px] md:min-h-[500px] overflow-hidden">
              <motion.img
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[activeImg] || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {/* Zoom hint */}
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                <ZoomIn className="h-3 w-3" /> Hover to zoom
              </div>
              {/* Nav arrows if multiple images */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => setActiveImg(p => (p + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? "border-primary" : "border-transparent"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-[48%] p-6 md:p-8 flex flex-col overflow-y-auto">
            <div className="flex-1 space-y-5">
              {/* Category + badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-primary/15 text-primary border-primary/30 text-xs font-bold uppercase tracking-wider">
                  {product.category}
                </Badge>
                {discount && <Badge className="bg-secondary text-secondary-foreground text-xs">-{discount}% OFF</Badge>}
                {product.featured && <Badge variant="outline" className="text-xs border-primary/40 text-primary">✦ Featured</Badge>}
              </div>

              {/* Name */}
              <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">{product.name}</h2>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{rating.toFixed(1)} {reviewCount > 0 ? `(${reviewCount} reviews)` : ""}</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                {comparePrice && (
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compareAtPrice!)}</span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Crafted with precision and designed to make a statement. Every piece in the Gemessence collection embodies modern opulence and timeless elegance — a testament to master craftsmanship.
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-2 border border-border rounded-full px-3 py-1">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="h-6 w-6 flex items-center justify-center hover:text-primary transition-colors">−</button>
                  <span className="w-6 text-center font-bold text-sm">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="h-6 w-6 flex items-center justify-center hover:text-primary transition-colors">+</button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <Button
                  className={`flex-1 h-12 text-base font-semibold rounded-xl transition-all ${justAdded || inCart ? "bg-green-600 hover:bg-green-700 text-white" : "gold-glow-hover"}`}
                  onClick={handleAddToCart}
                  disabled={product.inStock === false}
                >
                  {justAdded ? <><Check className="w-5 h-5 mr-2" /> Added to Cart!</> : inCart ? <><Check className="w-5 h-5 mr-2" /> In Cart</> : <><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</>}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-12 w-12 rounded-xl border-border hover:border-primary transition-colors ${isWishlisted ? "text-red-500 border-red-300" : ""}`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Truck, label: "Free Shipping", sub: "Orders over KES 5,000" },
                  { icon: Shield, label: "Lifetime Warranty", sub: "Quality guaranteed" },
                  { icon: RotateCcw, label: "Easy Returns", sub: "30-day policy" },
                ].map((t) => (
                  <div key={t.label} className="flex flex-col items-center text-center p-2 rounded-xl bg-muted/50">
                    <t.icon className="h-4 w-4 text-primary mb-1" />
                    <p className="text-xs font-semibold leading-tight">{t.label}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{t.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
