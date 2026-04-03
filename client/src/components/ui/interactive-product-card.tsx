import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/use-currency";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  featured?: boolean;
  rating?: number;
  reviews?: number;
}

interface InteractiveProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export function InteractiveProductCard({ product, onClick }: InteractiveProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { formatPrice } = useCurrency();

  return (
    <motion.div
      className="group relative bg-card rounded-2xl overflow-hidden shadow-lg"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Overlay gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Category badge */}
        <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
          {product.category}
        </Badge>

        {/* Action buttons */}
        <motion.div
          className="absolute top-4 right-4 flex flex-col gap-2"
          animate={{ 
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : 20
          }}
          transition={{ duration: 0.3, staggerChildren: 0.1 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
            >
              <Heart 
                className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(product);
              }}
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Quick add to cart */}
        <motion.div
          className="absolute bottom-4 left-4 right-4"
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full gold-glow-hover"
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating!) 
                    ? 'fill-primary text-primary' 
                    : 'text-muted-foreground'
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              ({product.reviews || 0})
            </span>
          </div>
        )}

        <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-dual-accent">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-secondary hover:bg-secondary/90"
              onClick={(e) => {
                e.stopPropagation();
                // Add to cart
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        animate={{ 
          x: isHovered ? "100%" : "-100%",
          transition: { duration: 0.6 }
        }}
      />
    </motion.div>
  );
}