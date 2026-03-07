import { motion, AnimatePresence } from "framer-motion";
import { type Product } from "@shared/schema";
import { X, ShoppingCart, Heart } from "lucide-react";
import { Button } from "./ui/button";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(product.price));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />
        
        <motion.div
          layoutId={`product-${product.id}`}
          className="relative w-full max-w-5xl bg-card rounded-3xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/50 border border-border flex flex-col md:flex-row z-10 max-h-[90vh]"
        >
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 rounded-full bg-background/50 hover:bg-background backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Image Section */}
          <div className="w-full md:w-1/2 h-[40vh] md:h-auto bg-muted relative overflow-hidden">
            <motion.img
              layoutId={`product-image-${product.id}`}
              src={product.imageUrl || "https://images.unsplash.com/photo-1599643478524-fb66f70d00f8?w=1200&q=80"}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <div className="text-sm font-bold text-primary uppercase tracking-widest mb-2">
                {product.category}
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {product.name}
              </h2>
              <div className="text-2xl font-display font-medium text-muted-foreground mb-6">
                {formattedPrice}
              </div>
              
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mb-8">
                <p className="leading-relaxed text-base">{product.description}</p>
                <p className="mt-4">
                  Crafted with precision and designed to make a statement. 
                  Every piece in the GemEssence collection embodies modern opulence 
                  and timeless elegance.
                </p>
              </div>

              <div className="space-y-4 mt-auto">
                <div className="flex gap-4">
                  <Button className="flex-1 h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 gold-glow-hover rounded-xl">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl border-primary/20 hover:border-primary hover:text-primary transition-colors">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
                  Free shipping on orders over $500
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
