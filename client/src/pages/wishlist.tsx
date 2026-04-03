import { Navbar } from "@/components/layout/navbar";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/hooks/use-auth";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist, isLoading, removeFromWishlist } = useWishlist(user?.id);
  const { data: products } = useProducts();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Please log in to view your wishlist</h1>
            <Link href="/auth">
              <Button>Log In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const wishlistProducts = wishlist?.map((item: any) => item.product).filter(Boolean) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="font-display text-4xl font-bold mb-2 flex items-center gap-3">
                <Heart className="w-10 h-10 text-primary" />
                My Wishlist
              </h1>
              <p className="text-muted-foreground">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"} saved for later
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : wishlistProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistProducts.map((product: any, index: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard
                      product={product}
                      onClick={() => {}}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => removeFromWishlist(user.id!, product.id)}
                    >
                      Remove from Wishlist
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-24 h-24 mx-auto text-muted-foreground/30 mb-6" />
                <h2 className="font-display text-2xl font-bold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Save your favorite pieces to your wishlist for later
                </p>
                <Link href="/#collections">
                  <Button className="gold-glow">
                    Browse Collection <ShoppingBag className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
