import { Link } from "wouter";
import { ThemeToggle } from "../ui/theme-toggle";
import { CurrencyToggle } from "../ui/currency-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { GemessenceLogo } from "@/components/ui/gemessence-logo";
import {
  LogOut,
  User,
  Menu,
  ShoppingCart,
  Heart,
  Package,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sessionId = localStorage.getItem("cart_session_id");
  const { cart } = useCart(sessionId || undefined);
  const totalItems = cart?.totalItems || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-panel shadow-sm" : "bg-transparent"
      }`}
    >
      {/* Row 1: Logo top-left + action icons top-right */}
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between py-3">
        <Link href="/" className="flex items-center group">
          <GemessenceLogo width={160} className="group-hover:opacity-90 transition-opacity" />
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <CurrencyToggle />
          <ThemeToggle />

          {/* Cart Icon */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {totalItems > 9 ? "9+" : totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <>
              {/* Wishlist - Desktop */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>

              {/* Orders - Desktop */}
              <Link href="/orders">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Package className="w-5 h-5" />
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden md:flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="cursor-pointer flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/orders"
                      className="cursor-pointer flex items-center"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/wishlist"
                      className="cursor-pointer flex items-center"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="cursor-pointer text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Sign Out */}
              <Button
                variant="outline"
                onClick={() => logout()}
                className="md:hidden border-primary/50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow-hover rounded-full px-6">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Row 2: Nav centered */}
      <div className="hidden md:flex justify-center pb-2">
        <nav className="flex items-center gap-8 font-medium text-sm">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/#collections" className="hover:text-primary transition-colors">
            Collections
          </Link>
          <Link href="/#about" className="hover:text-primary transition-colors">
            Our Story
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border glass-panel">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              className="hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/#collections"
              className="hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/#about"
              className="hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Our Story
            </Link>
            {user && (
              <>
                <Link
                  href="/orders"
                  className="hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  href="/wishlist"
                  className="hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <Link
                  href="/dashboard"
                  className="hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
