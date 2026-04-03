import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export default function AdminDashboard() {
  // Mock data - in production, fetch from API
  const stats = [
    {
      name: "Total Revenue",
      value: "KES 2,450,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      name: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      name: "Total Products",
      value: "86",
      change: "+3",
      trend: "up",
      icon: Package,
    },
    {
      name: "Total Customers",
      value: "456",
      change: "+15.3%",
      trend: "up",
      icon: Users,
    },
  ];

  const recentOrders = [
    { id: 1, orderNumber: "GEM-1234567890-ABC123", customer: "John Doe", total: "KES 125,000", status: "processing", date: "2024-01-15" },
    { id: 2, orderNumber: "GEM-1234567891-DEF456", customer: "Jane Smith", total: "KES 85,000", status: "pending", date: "2024-01-15" },
    { id: 3, orderNumber: "GEM-1234567892-GHI789", customer: "Peter Kimani", total: "KES 225,000", status: "shipped", date: "2024-01-14" },
    { id: 4, orderNumber: "GEM-1234567893-JKL012", customer: "Mary Wanjiku", total: "KES 45,000", status: "delivered", date: "2024-01-14" },
    { id: 5, orderNumber: "GEM-1234567894-MNO345", customer: "David Omondi", total: "KES 175,000", status: "processing", date: "2024-01-13" },
  ];

  const topProducts = [
    { id: 1, name: "Diamond Solitaire Engagement Ring", sales: 45, revenue: "KES 5,625,000" },
    { id: 2, name: "Gold Chain Necklace 18k", sales: 38, revenue: "KES 3,230,000" },
    { id: 3, name: "Pearl Drop Earrings", sales: 32, revenue: "KES 272,000" },
    { id: 4, name: "Ruby Tennis Bracelet", sales: 28, revenue: "KES 2,660,000" },
    { id: 5, name: "Sapphire Halo Ring", sales: 22, revenue: "KES 3,850,000" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your store performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`flex items-center text-xs mt-1 ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{order.total}</p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">{product.revenue}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
