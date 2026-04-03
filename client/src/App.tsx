import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { CurrencyProvider } from "@/hooks/use-currency";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import OrdersPage from "@/pages/orders";
import OrderDetailPage from "@/pages/order-detail";
import WishlistPage from "@/pages/wishlist";
import AdminDashboardNew from "@/pages/admin/admin-dashboard-new";
import AdminProducts from "@/pages/admin/products";
import AdminOrders from "@/pages/admin/orders";
import SuperUserDashboard from "@/pages/admin/superuser-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/orders" component={OrdersPage} />
      <Route path="/orders/:id" component={OrderDetailPage} />
      <Route path="/wishlist" component={WishlistPage} />
      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboardNew} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/superuser" component={SuperUserDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <CurrencyProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
