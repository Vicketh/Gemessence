import { Navbar } from "@/components/layout/navbar";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useOrders, useConfig, useShippingCost } from "@/hooks/use-orders";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const sessionId = localStorage.getItem("cart_session_id") || `guest-${Date.now()}`;
  const { cart, isLoading: cartLoading } = useCart(sessionId);
  const { createOrder, isCreating } = useOrders(user?.id);
  const { data: config } = useConfig();

  const [formData, setFormData] = useState({
    shippingFirstName: "",
    shippingLastName: "",
    shippingPhone: "",
    shippingEmail: user?.email || "",
    shippingAddress: "",
    shippingCity: "",
    shippingCounty: "",
    shippingPostalCode: "",
    shippingInstructions: "",
    paymentMethod: "mpesa" as "mpesa" | "card" | "bank_transfer",
    mpesaPhoneNumber: "",
    saveAddress: false,
  });

  const { data: shippingData } = useShippingCost(formData.shippingCounty);

  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(typeof price === "string" ? parseFloat(price) : price);
  };

  const subtotal = cart?.subtotal || 0;
  const shippingCost = shippingData?.cost || 500;
  const tax = subtotal * 0.16;
  const total = subtotal + shippingCost + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart || cart.items.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty. Add items before checkout.",
        variant: "destructive",
      });
      setLocation("/cart");
      return;
    }

    if (!formData.shippingFirstName || !formData.shippingLastName || !formData.shippingPhone ||
        !formData.shippingEmail || !formData.shippingAddress || !formData.shippingCity ||
        !formData.shippingCounty) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.paymentMethod === "mpesa" && !formData.mpesaPhoneNumber) {
      toast({
        title: "M-Pesa Number Required",
        description: "Please enter your M-Pesa phone number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const order = await createOrder({
        checkoutData: formData,
        sessionId,
      });

      if (order) {
        setLocation(`/orders/${order.id}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  if (cartLoading || !cart) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Your cart is empty</h1>
            <Link href="/">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="mb-8">
              <Link href="/cart">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
                </Button>
              </Link>
              <h1 className="font-display text-4xl font-bold">Checkout</h1>
              <p className="text-muted-foreground mt-2">Complete your order securely</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Forms */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Contact Information */}
                  <Card className="border-border/50">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                        <Smartphone className="w-6 h-6" /> Contact Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.shippingEmail}
                            onChange={(e) => setFormData({ ...formData, shippingEmail: e.target.value })}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.shippingPhone}
                            onChange={(e) => setFormData({ ...formData, shippingPhone: e.target.value })}
                            placeholder="0712 345 678"
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Address */}
                  <Card className="border-border/50">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                        <Truck className="w-6 h-6" /> Shipping Address
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.shippingFirstName}
                            onChange={(e) => setFormData({ ...formData, shippingFirstName: e.target.value })}
                            placeholder="John"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.shippingLastName}
                            onChange={(e) => setFormData({ ...formData, shippingLastName: e.target.value })}
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          value={formData.shippingAddress}
                          onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                          placeholder="Building, Street, Apartment"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.shippingCity}
                            onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                            placeholder="Nairobi"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="county">County *</Label>
                          <Select
                            value={formData.shippingCounty}
                            onValueChange={(value) => setFormData({ ...formData, shippingCounty: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select county" />
                            </SelectTrigger>
                            <SelectContent>
                              {config?.counties?.map((county: string) => (
                                <SelectItem key={county} value={county}>
                                  {county}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={formData.shippingPostalCode}
                            onChange={(e) => setFormData({ ...formData, shippingPostalCode: e.target.value })}
                            placeholder="00100"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instructions">Delivery Instructions</Label>
                        <Textarea
                          id="instructions"
                          value={formData.shippingInstructions}
                          onChange={(e) => setFormData({ ...formData, shippingInstructions: e.target.value })}
                          placeholder="Landmarks, delivery preferences, etc."
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="saveAddress"
                          checked={formData.saveAddress}
                          onCheckedChange={(checked) => setFormData({ ...formData, saveAddress: !!checked })}
                        />
                        <Label htmlFor="saveAddress">Save this address for future orders</Label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Method */}
                  <Card className="border-border/50">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                        <CreditCard className="w-6 h-6" /> Payment Method
                      </h2>
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as any })}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                          <RadioGroupItem value="mpesa" id="mpesa" />
                          <Label htmlFor="mpesa" className="flex-1 cursor-pointer flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded flex items-center justify-center">
                              <span className="text-green-700 font-bold text-sm">M-PESA</span>
                            </div>
                            <div>
                              <p className="font-semibold">M-Pesa</p>
                              <p className="text-sm text-muted-foreground">Pay securely with M-Pesa mobile money</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                              <CreditCard className="w-6 h-6 text-blue-700" />
                            </div>
                            <div>
                              <p className="font-semibold">Credit/Debit Card</p>
                              <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                          <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                          <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              <Building className="w-6 h-6 text-gray-700" />
                            </div>
                            <div>
                              <p className="font-semibold">Bank Transfer</p>
                              <p className="text-sm text-muted-foreground">Direct bank transfer (EFT)</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>

                      {formData.paymentMethod === "mpesa" && (
                        <div className="space-y-2 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <Label htmlFor="mpesaPhone">M-Pesa Phone Number *</Label>
                          <Input
                            id="mpesaPhone"
                            type="tel"
                            value={formData.mpesaPhoneNumber}
                            onChange={(e) => setFormData({ ...formData, mpesaPhoneNumber: e.target.value })}
                            placeholder="0712 345 678"
                            required
                          />
                          <p className="text-xs text-green-700">
                            You'll receive an STK push on this number to complete payment
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="border-border/50 sticky top-4">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="font-display text-2xl font-bold mb-4">Order Summary</h2>

                      {/* Cart Items */}
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {cart.items.map((item) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="w-16 h-16 rounded bg-muted flex-shrink-0">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              <p className="text-primary font-semibold text-sm">
                                {formatPrice(parseFloat(item.priceAtAdd) * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-border pt-4 space-y-2">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal</span>
                          <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Shipping</span>
                          <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Tax (16% VAT)</span>
                          <span>{formatPrice(tax)}</span>
                        </div>
                        <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span className="text-primary">{formatPrice(total)}</span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full gold-glow text-lg py-6"
                        disabled={isCreating}
                      >
                        {isCreating ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                            Processing...
                          </span>
                        ) : formData.paymentMethod === "mpesa" ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Pay with M-Pesa
                          </span>
                        ) : (
                          "Place Order"
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        By placing this order, you agree to our Terms of Service and Privacy Policy
                      </p>
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
