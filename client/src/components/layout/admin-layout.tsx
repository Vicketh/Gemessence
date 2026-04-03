import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { GemessenceLogo } from "@/components/ui/gemessence-logo";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  FileText,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Categories", href: "/admin/categories", icon: FileText },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Allow admin or superuser
  if (!user || (!user.isAdmin && !(user as any).isSuperUser)) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link href="/admin" className="flex items-center">
              <GemessenceLogo height={28} />
              <span className="ml-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Admin</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
            {(user as any)?.isSuperUser && (
              <Link
                href="/admin/superuser"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-primary/20 mt-2"
                onClick={() => setSidebarOpen(false)}
              >
                <Shield className="w-5 h-5 text-primary" />
                Superuser Panel
              </Link>
            )}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm">{user.username}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                logout();
                setLocation("/");
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 border-b border-border bg-card/50 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex-1" />
          <Link href="/">
            <Button variant="outline" size="sm">
              View Store
            </Button>
          </Link>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
