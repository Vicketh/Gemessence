import { Link } from "wouter";
import { useTheme } from "next-themes";
import { ThemeToggle } from "../ui/theme-toggle";
import { CurrencyToggle } from "../ui/currency-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { GemessenceLogo } from "@/components/ui/gemessence-logo";
import { CartDrawer } from "@/components/ui/cart-drawer";
import { useCartContext } from "@/hooks/use-cart-context";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Shield,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const navGroups = [
  {
    label: "Gold",
    href: "/shop#gold",
    links: [
      { label: "Gold necklaces", href: "/shop#necklaces" },
      { label: "Gold bracelets", href: "/shop#bracelets" },
      { label: "Gold bangles", href: "/shop#artifacts" },
    ],
  },
  {
    label: "Silver",
    href: "/shop#silver",
    links: [
      { label: "Silver rings", href: "/shop#silver" },
      { label: "Silver earrings", href: "/shop#earrings" },
    ],
  },
  {
    label: "Diamond",
    href: "/shop#diamond",
    links: [
      { label: "Diamond rings", href: "/shop#diamond" },
      { label: "Diamond pendants", href: "/shop#necklaces" },
    ],
  },
  {
    label: "Artifacts",
    href: "/shop#artifacts",
    links: [
      { label: "Statement sets", href: "/shop#artifacts" },
      { label: "Bracelets & bangles", href: "/shop#bracelets" },
    ],
  },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCartContext();
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-border transition ${
          isScrolled ? "bg-background/92 shadow-sm backdrop-blur-xl" : "bg-background/82 backdrop-blur"
        }`}
      >
        <div className="border-b border-border/70 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Gemessence, jewellers of distinction since 2000
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 py-3 md:px-8 md:py-4 lg:py-5 h-20 md:h-24 lg:h-28 gap-4 md:gap-6">
          <nav className="hidden items-center gap-7 md:flex">
            {navGroups.slice(0, 2).map((group) => (
              <NavGroup key={group.label} group={group} />
            ))}
            <Link href="/shop#collections" className="text-sm font-medium hover:text-primary">
              Shop
            </Link>
          </nav>

          <Link href="/" className="flex items-center justify-center">
            <div className="flex h-[60px] items-center justify-center md:h-[75px] lg:h-[100px]">
              <GemessenceLogo
                variant="full"
                height="100%"
                className="max-h-full w-auto"
              />
            </div>
          </Link>

          <div className="flex items-center justify-end gap-1 md:gap-2">
            <nav className="mr-4 hidden items-center gap-7 md:flex">
              {navGroups.slice(2).map((group) => (
                <NavGroup key={group.label} group={group} />
              ))}
              <a href="/#contact" className="text-sm font-medium hover:text-primary">
                Contact
              </a>
            </nav>

            <CurrencyToggle />
            <ThemeToggle />

            <Button variant="ghost" size="icon" className="relative rounded-sm" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
                  {totalItems > 9 ? "9+" : totalItems}
                </Badge>
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden h-9 items-center gap-2 rounded-sm px-2 md:flex">
                    <User className="h-4 w-4" />
                    <span className="max-w-24 truncate text-sm">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer"><Package className="mr-2 h-4 w-4" />Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer"><Heart className="mr-2 h-4 w-4" />Wishlist</Link>
                  </DropdownMenuItem>
                  {(user as any)?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer text-primary"><Shield className="mr-2 h-4 w-4" />Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth" className="hidden md:block">
                <Button variant="outline" className="h-9 rounded-sm px-4 text-sm">
                  Log in
                </Button>
              </Link>
            )}

            {(user as any)?.isAdmin && (
              <Link href="/admin" className="hidden md:block">
                <Button className="h-9 rounded-sm px-4 text-sm">
                  Dashboard
                </Button>
              </Link>
            )}

            <Button variant="ghost" size="icon" className="rounded-sm md:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label="Open menu">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-background/98 px-4 py-4 shadow-lg backdrop-blur-xl md:hidden">
            <nav className="grid gap-1">
              {[...navGroups, { label: "Shop", href: "/shop#collections", links: [] }, { label: "Contact", href: "/#contact", links: [] }].map((group) => (
                <Link
                  key={group.label}
                  href={group.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-sm px-3 py-2.5 text-sm font-medium hover:bg-muted hover:text-primary"
                >
                  {group.label}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-sm px-3 py-2.5 text-sm font-medium hover:bg-muted">
                Dashboard
              </Link>
              {user ? (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="rounded-sm px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-muted">
                  Sign out
                </button>
              ) : (
                <Link href="/auth" onClick={() => setMobileOpen(false)} className="rounded-sm px-3 py-2.5 text-sm font-medium hover:bg-muted">
                  Log in
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

function NavGroup({ group }: { group: { label: string; href: string; links: { label: string; href: string }[] } }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Link href={group.href} className="text-sm font-medium hover:text-primary">
          {group.label}
        </Link>
      </DropdownMenuTrigger>
      {group.links.length > 0 && (
        <DropdownMenuContent align="start" className="w-52">
          {group.links.map((link) => (
            <DropdownMenuItem key={link.label} asChild>
              <Link href={link.href} className="cursor-pointer">
                {link.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
