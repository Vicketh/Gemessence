import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, ArrowRight, Mail, Lock, User } from "lucide-react";
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
import heroImg from "@assets/Hero_1772877259305.png";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, login, register, isLoginPending, isRegisterPending } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const onSubmitLogin = (data: z.infer<typeof loginSchema>) => {
    login(data);
  };

  const onSubmitRegister = (data: z.infer<typeof registerSchema>) => {
    register(data);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left side: Image/Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img 
            src={heroImg} 
            alt="Opulence" 
            className="w-full h-full object-cover scale-105"
          />
        </div>
        
        <div className="relative z-20 p-12 flex flex-col h-full justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <Gem className="w-5 h-5" />
            </div>
            <span className="font-display text-2xl font-bold tracking-wider text-white">
              GemEssence
            </span>
          </div>

          <div className="max-w-xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-5xl font-bold text-white mb-6 leading-tight"
            >
              Enter a World of <br/>
              <span className="text-primary">Unrivaled Elegance</span>
            </motion.h1>
            <p className="text-white/80 text-lg font-light">
              Join our exclusive clientele to unlock personalized curations, early access to new collections, and seamless bespoke services.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-6 right-6 lg:hidden flex items-center gap-2">
          <Gem className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-bold tracking-wider">GemEssence</span>
        </div>

        <div className="w-full max-w-md bg-card p-8 sm:p-10 rounded-3xl border border-border/50 shadow-2xl shadow-black/5 dark:shadow-black/40 relative overflow-hidden">
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
                  <h2 className="font-display text-3xl font-bold mb-2">Welcome Back</h2>
                  <p className="text-muted-foreground">Sign in to access your bespoke experience.</p>
                </div>

                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-5">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input 
                                placeholder="name@example.com" 
                                className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
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
                            <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Password</FormLabel>
                            <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
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
                      className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gold-glow-hover rounded-xl mt-4"
                      disabled={isLoginPending}
                    >
                      {isLoginPending ? "Authenticating..." : "Sign In"}
                      {!isLoginPending && <ArrowRight className="w-4 h-4 ml-2" />}
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
                  <h2 className="font-display text-3xl font-bold mb-2">Create Account</h2>
                  <p className="text-muted-foreground">Begin your journey of exquisite taste.</p>
                </div>

                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="space-y-5">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input 
                                placeholder="johndoe" 
                                className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
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
                          <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input 
                                placeholder="name@example.com" 
                                className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
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
                          <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
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
                      className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gold-glow-hover rounded-xl mt-4"
                      disabled={isRegisterPending}
                    >
                      {isRegisterPending ? "Creating..." : "Create Account"}
                      {!isRegisterPending && <ArrowRight className="w-4 h-4 ml-2" />}
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
