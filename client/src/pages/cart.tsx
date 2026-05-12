import { Navbar } from "@/components/layout/navbar";
import { useCartContext } from "@/hooks/use-cart-context";
import { useCurrency } from "@/hooks/use-currency";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveImageUrl } from "@/lib/utils";

export default function CartPage() {
  const { items, totalItems, subtotal, removeItem, updateQty, clearCart } = useCartContext();
  const { formatPrice } = useCurrency();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-background pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md px-4">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Discover our exquisite collection of fine jewelry and find the perfect piece.
            </p>
            <Link href="/#collections">
              <Button className="gold-glow-hover">
                Start Shopping <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 py-12 pt-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-4xl font-bold">Shopping Cart</h1>
                <p className="text-muted-foreground mt-1">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
              </div>
              <Button variant="outline" size="sm" onClick={clearCart} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                Clear Cart
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card rounded-2xl border border-border/50 p-5 flex gap-5"
                    >
                      <Link href={`/product/${item.slug || item.id}`} className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-muted block">
                        <img
                          src={resolveImageUrl(item.imageUrl) || "https://images.unsplash.com/photo-1599643478524-fb66f70d00f8?w=400&q=80"}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-0.5">{item.category}</p>
                            <Link href={`/product/${item.slug || item.id}`}>
                              <h3 className="font-display text-lg font-bold hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                            </Link>
                          </div>
                          <p className="font-display text-lg font-bold text-primary flex-shrink-0">
                            {formatPrice((item.price * item.quantity).toString())}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 border border-border rounded-full px-3 py-1">
                            <button onClick={() => updateQty(item.id, item.quantity - 1)} className="h-6 w-6 flex items-center justify-center hover:text-primary transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, item.quantity + 1)} className="h-6 w-6 flex items-center justify-center hover:text-primary transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">{formatPrice(item.price.toString())} each</span>
                            <button onClick={() => removeItem(item.id)} className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10 ml-2">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-2xl border border-border/50 p-6 sticky top-24">
                  <h2 className="font-display text-2xl font-bold mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>{formatPrice(subtotal.toString())}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-green-500 text-sm">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax (16% VAT)</span>
                      <span>{formatPrice(tax.toString())}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                      <span>Estimated Total</span>
                      <span className="text-primary">{formatPrice(total.toString())}</span>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <Button className="w-full gold-glow-hover text-base h-12">
                      Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/#collections">
                    <Button variant="outline" className="w-full mt-3">Continue Shopping</Button>
                  </Link>
                  <p className="text-xs text-muted-foreground text-center mt-4">🔒 Secure checkout powered by M-Pesa</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
