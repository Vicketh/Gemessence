import { Navbar } from "@/components/layout/navbar";
import { useOrders } from "@/hooks/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Package, Search, ArrowRight, Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders, isLoading } = useOrders(user?.id);

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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 border-red-300";
      case "refunded":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Please log in to view your orders</h1>
            <Link href="/auth">
              <Button>Log In</Button>
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
            <div className="mb-8">
              <h1 className="font-display text-4xl font-bold mb-2">My Orders</h1>
              <p className="text-muted-foreground">Track and manage your orders</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order: any, index: number) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-border/50 hover:border-primary/30 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-display text-xl font-bold">
                                Order #{order.orderNumber}
                              </h3>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                              <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(order.createdAt), "MMM d, yyyy")}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline">
                              View Details <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>

                        {/* Order Items Preview */}
                        <div className="border-t border-border pt-4">
                          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                            <Package className="w-4 h-4" />
                            <span>{order.items.length} {order.items.length === 1 ? "item" : "items"}</span>
                          </div>
                          <div className="flex gap-3 overflow-x-auto">
                            {order.items.slice(0, 4).map((item: any) => (
                              <div key={item.id} className="flex-shrink-0 w-20 h-20 rounded bg-muted">
                                {item.productImageUrl && (
                                  <img
                                    src={item.productImageUrl}
                                    alt={item.productName}
                                    className="w-full h-full object-cover rounded"
                                  />
                                )}
                              </div>
                            ))}
                            {order.items.length > 4 && (
                              <div className="flex-shrink-0 w-20 h-20 rounded bg-muted flex items-center justify-center text-muted-foreground">
                                +{order.items.length - 4}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="border-t border-border mt-4 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-semibold mb-1">Shipping Address</p>
                            <p className="text-muted-foreground">
                              {order.shippingFirstName} {order.shippingLastName}<br />
                              {order.shippingAddress}<br />
                              {order.shippingCity}, {order.shippingCounty}<br />
                              {order.shippingPhone}
                            </p>
                          </div>
                          <div>
                            <p className="font-semibold mb-1">Payment Method</p>
                            <p className="text-muted-foreground">
                              {order.paymentMethod === "mpesa" && "M-Pesa"}
                              {order.paymentMethod === "card" && "Credit/Debit Card"}
                              {order.paymentMethod === "bank_transfer" && "Bank Transfer"}
                              {order.mpesaReceiptNumber && (
                                <span className="block mt-1 text-green-600">
                                  Receipt: {order.mpesaReceiptNumber}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-24 h-24 mx-auto text-muted-foreground/30 mb-6" />
                <h2 className="font-display text-2xl font-bold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">
                  Start shopping and your orders will appear here
                </p>
                <Link href="/">
                  <Button className="gold-glow">
                    Browse Collection <Search className="w-4 h-4 ml-2" />
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
