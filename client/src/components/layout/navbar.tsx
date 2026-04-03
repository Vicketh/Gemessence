import { Link } from "wouter";
import { ThemeToggle } from "../ui/theme-toggle";
import { CurrencyToggle } from "../ui/currency-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { GemessenceLogo } from "@/components/ui/gemessence-logo";
import { CartDrawer } from "@/components/ui/cart-drawer";
import { useCartContext } from "@/hooks/use-cart-context";
import { LogOut, User, Menu, X, ShoppingCart, Heart, Package, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCartContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/#collections" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "glass-panel shadow-lg" : "bg-transparent"}`}>
        {/* Main row */}
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <GemessenceLogo height={36} className="group-hover:opacity-90 transition-opacity" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="hover:text-primary transition-colors duration-200 relative group">
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            {(user as any)?.isAdmin && (
              <Link href="/admin" className="text-primary font-semibold flex items-center gap-1 hover:text-primary/80 transition-colors">
                <Shield className="h-3.5 w-3.5" /> Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <CurrencyToggle />
            <ThemeToggle />

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground animate-bounce">
                  {totalItems > 9 ? "9+" : totalItems}
                </Badge>
              )}
            </Button>

            {user ? (
              <>
                <Link href="/wishlist">
                  <Button variant="ghost" size="icon" className="hidden md:flex"><Heart className="w-5 h-5" /></Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden md:flex items-center gap-2 hover:bg-primary/10 hover:text-primary rounded-full px-3">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {user.username.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{user.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/dashboard" className="cursor-pointer flex items-center"><User className="w-4 h-4 mr-2" />Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/orders" className="cursor-pointer flex items-center"><Package className="w-4 h-4 mr-2" />Orders</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/wishlist" className="cursor-pointer flex items-center"><Heart className="w-4 h-4 mr-2" />Wishlist</Link></DropdownMenuItem>
                    {(user as any)?.isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href="/admin" className="cursor-pointer flex items-center text-primary"><Shield className="w-4 h-4 mr-2" />Admin Panel</Link></DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-destructive"><LogOut className="w-4 h-4 mr-2" />Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" onClick={() => logout()} className="md:hidden border-primary/50 h-8 w-8 p-0 rounded-full">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow-hover rounded-full px-5 h-9 text-sm font-semibold">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile hamburger */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border shadow-xl">
            <nav className="flex flex-col p-5 space-y-1">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} className="py-2.5 px-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors font-medium" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
              {user && (
                <>
                  <div className="border-t border-border my-2" />
                  <Link href="/orders" className="py-2.5 px-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>Orders</Link>
                  <Link href="/wishlist" className="py-2.5 px-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>Wishlist</Link>
                  <Link href="/dashboard" className="py-2.5 px-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>Account</Link>
                  {(user as any)?.isAdmin && (
                    <Link href="/admin" className="py-2.5 px-3 rounded-lg text-primary font-semibold flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
