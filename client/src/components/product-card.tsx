import { motion } from "framer-motion";
import { type Product } from "@shared/schema";
import { ShoppingBag, Eye } from "lucide-react";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  // Format price gracefully
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(product.price));

  return (
    <motion.div
      layoutId={`product-${product.id}`}
      className="group cursor-pointer relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-colors duration-500"
      onClick={() => onClick(product)}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="aspect-[4/5] overflow-hidden relative bg-muted/30">
        {/* Placeholder image from Unsplash to ensure visual quality if imageUrl fails */}
        <motion.img
          layoutId={`product-image-${product.id}`}
          src={product.imageUrl || "https://images.unsplash.com/photo-1599643478524-fb66f70d00f8?w=800&q=80"}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Hover overlay actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 hover:bg-primary hover:text-primary-foreground gold-glow">
            <Eye className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 hover:bg-primary hover:text-primary-foreground gold-glow">
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </div>
        
        {product.featured && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            Featured
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-2 relative z-10 bg-card">
        <div className="text-xs font-semibold text-primary uppercase tracking-widest">
          {product.category}
        </div>
        <h3 className="font-display text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="font-sans font-medium text-muted-foreground line-clamp-2 text-sm flex-1 mr-4">
            {product.description}
          </p>
          <p className="font-display text-xl font-bold text-foreground">
            {formattedPrice}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
