import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, ArrowRight, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// Slideshow hero images — portrait shots featuring models with jewelry
const JEWELRY_IMAGES = [
  `${BASE}/Gemini_Generated_Image_b8tezgb8tezgb8te.png`,
  `${BASE}/Gemini_Generated_Image_qkhmuyqkhmuyqkhm.png`,
];

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const { user, login, register, isLoginPending, isRegisterPending } =
    useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  // Auto-rotate images
  useEffect(() => {
    if (!isAutoPlay || JEWELRY_IMAGES.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % JEWELRY_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "" },
  });

  const onSubmitLogin = (data: z.infer<typeof loginSchema>) => {
    login(data);
  };

  const onSubmitRegister = (data: z.infer<typeof registerSchema>) => {
    register(data);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left side: Split panel — model hero top, jewelry piece bottom */}
      <div className="hidden lg:flex w-1/2 relative flex-col overflow-hidden">
        {/* Top 65%: model hero image with slide transition */}
        <div className="relative flex-[65] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={JEWELRY_IMAGES[currentImageIndex]}
              alt="Luxury Jewelry Model"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

          {/* Brand mark top-left */}
          <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Gem className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-wider text-white drop-shadow">GemEssence</span>
          </div>

          {/* Headline bottom of top panel */}
          <div className="absolute bottom-6 left-8 right-8 z-20">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="font-display text-4xl font-bold text-white leading-tight mb-2"
            >
              Enter a World of<br />
              <span className="text-primary">Unrivaled Elegance</span>
            </motion.h1>
          </div>
        </div>

        {/* Bottom 35%: jewelry close-up */}
        <div className="relative flex-[35] overflow-hidden">
          <img
            src={`${BASE}/assets/new/Gem (1).png`}
            alt="Gemessence Jewelry"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 z-10">
            <p className="text-white/85 text-sm font-light leading-relaxed">
              Join our exclusive clientele to unlock personalized curations,
              early access to new collections, and bespoke services.
            </p>
          </div>

          {/* Slide indicators */}
          <div className="absolute top-4 right-6 flex gap-2 z-10">
            {JEWELRY_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrentImageIndex(idx); setIsAutoPlay(false); }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? "bg-primary w-5" : "bg-white/40 w-1.5 hover:bg-white/60"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-6 right-6 lg:hidden flex items-center gap-2">
          <Gem className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-bold tracking-wider">
            GemEssence
          </span>
        </div>

        <div className="w-full max-w-md bg-card p-8 sm:p-10 rounded-sm border border-border/50 shadow-2xl shadow-black/5 dark:shadow-black/40 relative overflow-hidden">
          {/* Subtle gold accent border at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="font-display text-3xl font-bold mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-muted-foreground">
                    Sign in to access your bespoke experience.
                  </p>
                </div>

                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onSubmitLogin)}
                    className="space-y-5"
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">
                            Username
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                placeholder="admin"
                                className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-sm"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">
                              Password
                            </FormLabel>
                            <a
                              href="#"
                              className="text-xs text-primary hover:underline"
                            >
                              Forgot password?
                            </a>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-sm"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gold-glow-hover rounded-sm mt-4"
                      disabled={isLoginPending}
                    >
                      {isLoginPending ? "Authenticating..." : "Sign In"}
                      {!isLoginPending && (
                        <ArrowRight className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-primary font-semibold hover:underline"
                  >
                    Create an account
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="font-display text-3xl font-bold mb-2">
                    Create Account
                  </h2>
                  <p className="text-muted-foreground">
                    Begin your journey of exquisite taste.
                  </p>
                </div>

                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onSubmitRegister)}
                    className="space-y-5"
                  >
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">
                            Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                placeholder="Jane Doe"
                                className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-sm"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">
                            Email
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                placeholder="name@example.com"
                                className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-sm"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">
                            Phone number
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                placeholder="+254..."
                                className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-sm"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-sm"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gold-glow-hover rounded-sm mt-4"
                      disabled={isRegisterPending}
                    >
                      {isRegisterPending ? "Creating..." : "Create Account"}
                      {!isRegisterPending && (
                        <ArrowRight className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign in
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
