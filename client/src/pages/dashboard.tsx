import { useAuth } from "@/hooks/use-auth";
import { useProducts } from "@/hooks/use-products";
import { Navbar } from "@/components/layout/navbar";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { useState } from "react";
import { type Product } from "@shared/schema";
import { motion } from "framer-motion";
import { Package, Clock, Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import heroImg from "@assets/Hero_1772877259305.png";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: products, isLoading: productsLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  // Protect route
  if (!authLoading && !user) {
    setLocation("/auth");
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Dashboard Condensed Hero */}
      <section className="pt-24 pb-12 relative overflow-hidden bg-card border-b border-border">
        <div className="absolute inset-0 opacity-20 dark:opacity-10 z-0">
          <img src={heroImg} alt="Texture" className="w-full h-full object-cover blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
              Welcome back, <span className="text-primary">{user?.username}</span>
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${user?.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              {user?.isVerified ? 'Verified Member' : 'Pending Verification'} • Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { label: "Orders", value: "0", icon: Package },
              { label: "Wishlist", value: "12", icon: Heart },
              { label: "Recently Viewed", value: "24", icon: Clock },
              { label: "Gem Points", value: "500", icon: Sparkles, color: "text-primary" },
            ].map((stat, i) => (
              <div key={i} className="bg-background/80 backdrop-blur-md border border-border/50 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color || 'text-muted-foreground'}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="font-display text-2xl font-bold">Exclusive Catalog</h2>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search collections..." 
                className="pl-10 bg-card rounded-full border-border focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-card rounded-2xl border border-border p-4">
                  <div className="bg-muted aspect-[4/5] rounded-xl mb-4" />
                  <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                </div>
              ))}
            </div>
          ) : filteredProducts?.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border/50">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">No pieces found</h3>
              <p className="text-muted-foreground">We couldn't find anything matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts?.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product as Product} 
                  onClick={setSelectedProduct} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}

// Need to import Sparkles since I used it in stats array
import { Sparkles } from "lucide-react";
