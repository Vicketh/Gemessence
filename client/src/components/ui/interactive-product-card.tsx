import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/use-currency";
import { useCartContext } from "@/hooks/use-cart-context";
import { useToast } from "@/hooks/use-toast";
import { resolveImageUrl } from "@/lib/utils";
import { Link } from "wouter";

export interface ProductCardData {
  id: number;
  name: string;
  description: string;
  price: string;
  compareAtPrice?: string | null;
  imageUrl: string;
  category: string;
  featured?: boolean | null;
  inStock?: boolean | null;
  averageRating?: number;
  reviewCount?: number;
  slug?: string;
}

interface InteractiveProductCardProps {
  product: ProductCardData;
  onClick?: (product: ProductCardData) => void;
}

export function InteractiveProductCard({ product, onClick }: InteractiveProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { formatPrice } = useCurrency();
  const { addItem, isInCart } = useCartContext();
  const { toast } = useToast();

  const inCart = isInCart(product.id);
  const price = parseFloat(product.price);
  const comparePrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : null;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;
  const rating = product.averageRating ?? 4.8;
  const reviewCount = product.reviewCount ?? 0;
  const imgSrc = resolveImageUrl(product.imageUrl) || "https://images.unsplash.com/photo-1599643478524-fb66f70d00f8?w=800&q=80";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price, imageUrl: product.imageUrl, category: product.category, slug: product.slug });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    toast({ title: "Added to cart ✓", description: product.name });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast({ title: isWishlisted ? "Removed from wishlist" : "Saved to wishlist ♥", description: product.name });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(product);
  };

  return (
    <motion.div
      className="group relative bg-card rounded-2xl overflow-hidden shadow-md border border-border/50 hover:border-primary/40 hover:shadow-xl transition-all duration-300"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      {/* Entire card is a link to product detail */}
      <Link href={`/product/${product.slug || product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <motion.img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.06 : 1 }}
            transition={{ duration: 0.5 }}
            loading="lazy"
          />

          {/* Dark gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent"
            animate={{ opacity: isHovered ? 1 : 0.25 }}
            transition={{ duration: 0.3 }}
          />

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            <Badge className="bg-primary/90 text-primary-foreground text-xs font-semibold shadow">
              {product.category}
            </Badge>
            {discount && (
              <Badge className="bg-secondary text-secondary-foreground text-xs font-bold shadow">
                -{discount}%
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-black/70 text-white text-xs border border-primary/50 shadow">
                ✦ Featured
              </Badge>
            )}
          </div>

          {/* Top-right action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <motion.button
              className="h-9 w-9 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center shadow-lg"
              onClick={handleWishlist}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              animate={{ opacity: isHovered ? 1 : 0.75 }}
            >
              <Heart className={`h-4 w-4 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"}`} />
            </motion.button>

            <motion.button
              className="h-9 w-9 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center shadow-lg"
              onClick={handleQuickView}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 8 }}
              transition={{ duration: 0.2 }}
            >
              <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </motion.button>
          </div>

          {/* Bottom Quick Add */}
          <motion.div
            className="absolute bottom-4 left-4 right-4"
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 14 }}
            transition={{ duration: 0.22 }}
          >
            <button
              className={`w-full py-2.5 rounded-full font-semibold text-sm shadow-lg flex items-center justify-center gap-2 transition-colors ${
                justAdded || inCart
                  ? "bg-green-600 text-white"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
              onClick={handleAddToCart}
            >
              {justAdded ? (
                <><Check className="h-4 w-4" /> Added!</>
              ) : inCart ? (
                <><Check className="h-4 w-4" /> In Cart</>
              ) : (
                <><ShoppingCart className="h-4 w-4" /> Quick Add</>
              )}
            </button>
          </motion.div>

          {/* Out of stock */}
          {product.inStock === false && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
              <span className="bg-black/80 text-white text-sm font-semibold px-4 py-2 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-4">
          <div className="flex items-center gap-0.5 mb-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
            ))}
            {reviewCount > 0 && <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span>}
          </div>

          <h3 className="font-display text-sm font-bold leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-xs mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-display text-base font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {comparePrice && (
                <span className="text-xs text-muted-foreground line-through ml-1.5">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>
            <button
              className={`h-8 w-8 rounded-full flex items-center justify-center shadow transition-colors ${
                inCart ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
              onClick={handleAddToCart}
            >
              {inCart ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
