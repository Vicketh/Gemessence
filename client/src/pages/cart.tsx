import { Navbar } from "@/components/layout/navbar";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "@/hooks/use-wishlist";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { user } = useAuth();
  const sessionId = localStorage.getItem("cart_session_id") || `guest-${Date.now()}`;
  const { cart, isLoading, removeCartItem, updateCartItem, clearCart } = useCart(sessionId);
  const { addToWishlist } = useWishlist(user?.id);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!localStorage.getItem("cart_session_id")) {
      localStorage.setItem("cart_session_id", sessionId);
    }
  }, [sessionId]);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantities(prev => ({ ...prev, [itemId]: newQuantity }));
    updateCartItem({ cartItemId: itemId, data: { quantity: newQuantity } });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(parseFloat(price));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md px-4"
          >
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Discover our exquisite collection of fine jewelry and find the perfect piece to celebrate your special moments.
            </p>
            <Link href="/">
              <Button className="gold-glow">
                Start Shopping <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground mb-8">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"} in your cart
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item: any, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-2xl border border-border/50 p-6 flex gap-6"
                  >
                    {/* Product Image */}
                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
                              {item.product.category}
                            </p>
                            <h3 className="font-display text-xl font-bold">{item.product.name}</h3>
                          </div>
                          <p className="font-display text-xl font-bold text-primary">
                            {formatPrice(item.priceAtAdd)}
                          </p>
                        </div>

                        {/* Selected Options */}
                        {(item.ringSize || item.metalType || item.metalColor || item.chainLength) && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.ringSize && (
                              <span className="text-xs bg-muted px-2 py-1 rounded">Size: {item.ringSize}</span>
                            )}
                            {item.metalType && (
                              <span className="text-xs bg-muted px-2 py-1 rounded">{item.metalType}</span>
                            )}
                            {item.metalColor && (
                              <span className="text-xs bg-muted px-2 py-1 rounded">{item.metalColor}</span>
                            )}
                            {item.chainLength && (
                              <span className="text-xs bg-muted px-2 py-1 rounded">{item.chainLength}</span>
                            )}
                            {item.giftWrap && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">🎁 Gift Wrapped</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            readOnly
                            className="w-16 text-center h-8"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => addToWishlist(item.productId)}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeCartItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Clear Cart */}
                <Button
                  variant="outline"
                  onClick={() => clearCart()}
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card rounded-2xl border border-border/50 p-6 sticky top-4"
                >
                  <h2 className="font-display text-2xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatPrice(cart.subtotal.toString())}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax (16% VAT)</span>
                      <span>{formatPrice((cart.subtotal * 0.16).toString())}</span>
                    </div>
                    <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatPrice((cart.subtotal * 1.16).toString())}
                      </span>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full gold-glow text-lg py-6">
                      Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Secure checkout powered by M-Pesa
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
