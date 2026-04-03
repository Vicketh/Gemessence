import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingCart, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/use-currency";
import { useCartContext } from "@/hooks/use-cart-context";
import { useToast } from "@/hooks/use-toast";

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price,
      imageUrl: product.imageUrl,
      category: product.category,
      slug: product.slug,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
    });
  };

  return (
    <motion.div
      className="group relative bg-card rounded-2xl overflow-hidden shadow-lg cursor-pointer border border-border/50 hover:border-primary/40 transition-colors duration-300"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(201,162,39,0.15)" }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick?.(product)}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6 }}
          loading="lazy"
        />

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
          animate={{ opacity: isHovered ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge className="bg-primary/90 text-primary-foreground text-xs font-semibold">
            {product.category}
          </Badge>
          {discount && (
            <Badge className="bg-secondary text-secondary-foreground text-xs font-bold">
              -{discount}%
            </Badge>
          )}
          {product.featured && (
            <Badge className="bg-black/70 text-white text-xs border border-primary/50">
              ✦ Featured
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <motion.button
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          onClick={handleWishlist}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className={`h-4 w-4 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"}`} />
        </motion.button>

        {/* Quick view button */}
        <motion.div
          className="absolute top-14 right-3"
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
        >
          <button
            className="h-9 w-9 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            onClick={(e) => { e.stopPropagation(); onClick?.(product); }}
          >
            <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
        </motion.div>

        {/* Quick Add button */}
        <motion.div
          className="absolute bottom-4 left-4 right-4"
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 16 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <Button
            className={`w-full rounded-full font-semibold shadow-lg transition-all ${
              justAdded || inCart
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground gold-glow-hover"
            }`}
            onClick={handleAddToCart}
          >
            {justAdded ? (
              <><Check className="h-4 w-4 mr-2" /> Added!</>
            ) : inCart ? (
              <><Check className="h-4 w-4 mr-2" /> In Cart</>
            ) : (
              <><ShoppingCart className="h-4 w-4 mr-2" /> Quick Add</>
            )}
          </Button>
        </motion.div>

        {/* Out of stock overlay */}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-black/80 text-white text-sm font-semibold px-4 py-2 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
          ))}
          {reviewCount > 0 && <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span>}
        </div>

        <h3 className="font-display text-base font-bold leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-xs mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {comparePrice && (
              <span className="text-xs text-muted-foreground line-through ml-2">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
          <motion.button
            className={`h-9 w-9 rounded-full flex items-center justify-center shadow-md transition-colors ${
              inCart ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
          >
            {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </motion.button>
        </div>
      </div>

      {/* Shine sweep */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -skew-x-12 pointer-events-none"
        animate={{ x: isHovered ? "200%" : "-100%" }}
        transition={{ duration: 0.7 }}
      />
    </motion.div>
  );
}
