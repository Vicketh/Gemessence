import { Link } from "wouter";
import { ThemeToggle } from "../ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Gem, LogOut, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import navImg from "@assets/Navigation_bar_1772877259307.png";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

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
        isScrolled ? "glass-panel shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <Gem className="w-4 h-4" />
          </div>
          <span className="font-display text-xl font-bold tracking-wider group-hover:text-primary transition-colors">
            GemEssence
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="#collections" className="hover:text-primary transition-colors">Collections</Link>
          <Link href="#about" className="hover:text-primary transition-colors">Our Story</Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="hidden md:flex items-center gap-2 hover:bg-primary/10 hover:text-primary">
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => logout()}
                className="border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow-hover rounded-full px-6">
                Sign In
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
