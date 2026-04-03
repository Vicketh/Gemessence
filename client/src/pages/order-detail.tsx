import { Navbar } from "@/components/layout/navbar";
import { useOrder } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "wouter";
import { ArrowLeft, Package, Calendar, CreditCard, Truck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id ? parseInt(params.id) : 0;
  const { data: order, isLoading } = useOrder(orderId);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(parseFloat(price));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "refunded":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The order you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/orders">
              <Button>Back to Orders</Button>
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
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="mb-8">
              <Link href="/orders">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
                </Button>
              </Link>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-4xl font-bold mb-2">
                    Order #{order.orderNumber}
                  </h1>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(order.paymentStatus)}>
                      Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-semibold">{format(new Date(order.createdAt), "MMMM d, yyyy")}</p>
                  <p className="text-sm text-muted-foreground">Order Time</p>
                  <p className="font-semibold">{format(new Date(order.createdAt), "h:mm a")}</p>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <Card className="border-border/50 mb-6">
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" /> Order Status
                </h2>
                <div className="flex items-center justify-between">
                  {[
                    { key: "pending", label: "Order Placed", icon: CheckCircle },
                    { key: "processing", label: "Processing", icon: Package },
                    { key: "shipped", label: "Shipped", icon: Truck },
                    { key: "delivered", label: "Delivered", icon: CheckCircle },
                  ].map((step, index, arr) => {
                    const isActive = order.status === step.key;
                    const isCompleted = arr.findIndex(s => s.key === order.status) >= index;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                              isCompleted || isActive
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-muted border-border text-muted-foreground"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <p className="text-xs mt-2 font-medium text-center">{step.label}</p>
                        </div>
                        {index < arr.length - 1 && (
                          <div
                            className={`w-16 h-1 ${
                              isCompleted ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Items */}
              <div className="lg:col-span-2">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-bold mb-4">Order Items</h2>
                    <div className="space-y-4">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex gap-4 border-b border-border last:border-0 pb-4 last:pb-0">
                          <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                            {item.productImageUrl && (
                              <img
                                src={item.productImageUrl}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display font-semibold">{item.productName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-muted-foreground">Quantity: {item.quantity}</span>
                              <span className="text-sm text-muted-foreground">•</span>
                              <span className="text-primary font-semibold">
                                {formatPrice(item.unitPrice)}
                              </span>
                            </div>
                            {/* Item Options */}
                            {(item.ringSize || item.metalType || item.metalColor || item.chainLength || item.engraving) && (
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
                                {item.engraving && (
                                  <span className="text-xs bg-muted px-2 py-1 rounded">Engraving: {item.engraving}</span>
                                )}
                                {item.giftWrap && (
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">🎁 Gift Wrapped</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-display font-bold text-lg">
                              {formatPrice(item.total)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>{order.shippingCost === "0" ? "Free" : formatPrice(order.shippingCost)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax (16% VAT)</span>
                        <span>{formatPrice(order.tax)}</span>
                      </div>
                      {order.discount !== "0" && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-{formatPrice(order.discount)}</span>
                        </div>
                      )}
                      <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" /> Payment Info
                    </h2>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-semibold">
                        {order.paymentMethod === "mpesa" && "M-Pesa"}
                        {order.paymentMethod === "card" && "Credit/Debit Card"}
                        {order.paymentMethod === "bank_transfer" && "Bank Transfer"}
                      </p>
                    </div>
                    {order.mpesaReceiptNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">M-Pesa Receipt</p>
                        <p className="font-semibold text-green-600">{order.mpesaReceiptNumber}</p>
                      </div>
                    )}
                    {order.mpesaPhoneNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">Paid From</p>
                        <p className="font-semibold">{order.mpesaPhoneNumber}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                      <Truck className="w-5 h-5" /> Shipping Info
                    </h2>
                    <div>
                      <p className="font-semibold">
                        {order.shippingFirstName} {order.shippingLastName}
                      </p>
                      <p className="text-muted-foreground">{order.shippingAddress}</p>
                      <p className="text-muted-foreground">
                        {order.shippingCity}, {order.shippingCounty}
                        {order.shippingPostalCode && ` ${order.shippingPostalCode}`}
                      </p>
                      <p className="text-muted-foreground">{order.shippingPhone}</p>
                      <p className="text-muted-foreground">{order.shippingEmail}</p>
                    </div>
                    {order.shippingInstructions && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Delivery Instructions</p>
                        <p className="text-sm">{order.shippingInstructions}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
