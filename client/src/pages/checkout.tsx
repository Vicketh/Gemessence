import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useCartContext } from "@/hooks/use-cart-context";
import { useAuth } from "@/hooks/use-auth";
import { useCurrency } from "@/hooks/use-currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CreditCard, Smartphone, Building, CheckCircle, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/lib/supabase";
import { resolveImageUrl } from "@/lib/utils";
import { KENYAN_COUNTIES } from "@shared/schema";

export default function CheckoutPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { items, subtotal, totalItems, clearCart } = useCartContext();
  const { formatPrice } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: user?.email || "",
    address: "", city: "", county: "", postalCode: "", instructions: "",
    paymentMethod: "mpesa" as "mpesa" | "card" | "bank_transfer",
    mpesaPhone: "", saveAddress: false,
  });

  const shippingCost = 500;
  const tax = subtotal * 0.16;
  const total = subtotal + shippingCost + tax;

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast({ title: "Cart is empty", variant: "destructive" }); return; }
    if (!form.firstName || !form.lastName || !form.phone || !form.email || !form.address || !form.city || !form.county) {
      toast({ title: "Missing fields", description: "Please fill all required shipping fields.", variant: "destructive" }); return;
    }
    if (form.paymentMethod === "mpesa" && !form.mpesaPhone) {
      toast({ title: "M-Pesa number required", variant: "destructive" }); return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        user_id: user?.id || null,
        subtotal, shipping_cost: shippingCost, tax, discount: 0, total,
        currency: "KES", payment_method: form.paymentMethod,
        shipping_first_name: form.firstName, shipping_last_name: form.lastName,
        shipping_phone: form.phone, shipping_email: form.email,
        shipping_address: form.address, shipping_city: form.city,
        shipping_county: form.county, shipping_postal_code: form.postalCode,
        shipping_instructions: form.instructions,
        mpesa_phone_number: form.mpesaPhone || null,
        items: items.map(i => ({ productId: i.id, name: i.name, quantity: i.quantity, price: i.price, imageUrl: i.imageUrl })),
      };
      const order = await createOrder(orderData);
      clearCart();
      toast({ title: "Order placed! 🎉", description: `Order #${order.order_number} confirmed.` });
      setLocation(`/orders`);
    } catch (err: any) {
      toast({ title: "Order failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Your cart is empty</h1>
            <Link href="/"><Button>Start Shopping</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 py-12 pt-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8">
              <Link href="/cart"><Button variant="ghost" className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart</Button></Link>
              <h1 className="font-display text-4xl font-bold">Checkout</h1>
              <p className="text-muted-foreground mt-1">Complete your order securely</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact */}
                  <Card className="border-border/50">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="font-display text-xl font-bold flex items-center gap-2"><Smartphone className="w-5 h-5" /> Contact</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1"><Label>Email *</Label><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" required /></div>
                        <div className="space-y-1"><Label>Phone *</Label><Input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="0712 345 678" required /></div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping */}
                  <Card className="border-border/50">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="font-display text-xl font-bold flex items-center gap-2"><Truck className="w-5 h-5" /> Shipping Address</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><Label>First Name *</Label><Input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="John" required /></div>
                        <div className="space-y-1"><Label>Last Name *</Label><Input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Doe" required /></div>
                      </div>
                      <div className="space-y-1"><Label>Street Address *</Label><Input value={form.address} onChange={e => set("address", e.target.value)} placeholder="Building, Street" required /></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1"><Label>City *</Label><Input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Nairobi" required /></div>
                        <div className="space-y-1">
                          <Label>County *</Label>
                          <Select value={form.county} onValueChange={v => set("county", v)}>
                            <SelectTrigger><SelectValue placeholder="Select county" /></SelectTrigger>
                            <SelectContent>
                              {KENYAN_COUNTIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1"><Label>Postal Code</Label><Input value={form.postalCode} onChange={e => set("postalCode", e.target.value)} placeholder="00100" /></div>
                      </div>
                      <div className="space-y-1"><Label>Delivery Instructions</Label><Textarea value={form.instructions} onChange={e => set("instructions", e.target.value)} placeholder="Landmarks, preferences..." rows={2} /></div>
                      <div className="flex items-center gap-2"><Checkbox id="save" checked={form.saveAddress} onCheckedChange={v => set("saveAddress", !!v)} /><Label htmlFor="save">Save address for future orders</Label></div>
                    </CardContent>
                  </Card>

                  {/* Payment */}
                  <Card className="border-border/50">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="font-display text-xl font-bold flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Method</h2>
                      <RadioGroup value={form.paymentMethod} onValueChange={v => set("paymentMethod", v)} className="space-y-3">
                        {[
                          { value: "mpesa", label: "M-Pesa", sub: "Pay with M-Pesa mobile money", icon: <span className="text-green-700 font-bold text-xs">M-PESA</span>, bg: "bg-green-100" },
                          { value: "card", label: "Credit/Debit Card", sub: "Visa, Mastercard, Amex", icon: <CreditCard className="w-5 h-5 text-blue-700" />, bg: "bg-blue-100" },
                          { value: "bank_transfer", label: "Bank Transfer", sub: "Direct EFT", icon: <Building className="w-5 h-5 text-gray-700" />, bg: "bg-gray-100" },
                        ].map(opt => (
                          <div key={opt.value} className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${form.paymentMethod === opt.value ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}>
                            <RadioGroupItem value={opt.value} id={opt.value} />
                            <Label htmlFor={opt.value} className="flex-1 cursor-pointer flex items-center gap-3">
                              <div className={`w-10 h-10 ${opt.bg} rounded-lg flex items-center justify-center`}>{opt.icon}</div>
                              <div><p className="font-semibold text-sm">{opt.label}</p><p className="text-xs text-muted-foreground">{opt.sub}</p></div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {form.paymentMethod === "mpesa" && (
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl space-y-2">
                          <Label>M-Pesa Phone Number *</Label>
                          <Input type="tel" value={form.mpesaPhone} onChange={e => set("mpesaPhone", e.target.value)} placeholder="0712 345 678" required />
                          <p className="text-xs text-green-700 dark:text-green-400">You'll receive an STK push to complete payment</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                  <Card className="border-border/50 sticky top-24">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="font-display text-xl font-bold">Order Summary</h2>
                      <div className="space-y-3 max-h-56 overflow-y-auto">
                        {items.map(item => (
                          <div key={item.id} className="flex gap-3">
                            <div className="w-14 h-14 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                              <img src={resolveImageUrl(item.imageUrl) || ""} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              <p className="text-primary font-semibold text-xs">{formatPrice((item.price * item.quantity).toString())}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border pt-3 space-y-2 text-sm">
                        <div className="flex justify-between text-muted-foreground"><span>Subtotal ({totalItems})</span><span>{formatPrice(subtotal.toString())}</span></div>
                        <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{formatPrice(shippingCost.toString())}</span></div>
                        <div className="flex justify-between text-muted-foreground"><span>Tax (16%)</span><span>{formatPrice(tax.toString())}</span></div>
                        <div className="flex justify-between font-bold text-base pt-2 border-t border-border"><span>Total</span><span className="text-primary">{formatPrice(total.toString())}</span></div>
                      </div>
                      <Button type="submit" className="w-full gold-glow-hover h-12 text-base" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <span className="flex items-center gap-2"><div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />Processing...</span>
                        ) : form.paymentMethod === "mpesa" ? (
                          <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5" />Pay with M-Pesa</span>
                        ) : "Place Order"}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">🔒 Secure & encrypted checkout</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
