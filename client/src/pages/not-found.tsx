import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { GemessenceLogo } from "@/components/ui/gemessence-logo";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        {/* Logo */}
        <div className="mb-8">
          <GemessenceLogo height={48} className="mx-auto" />
        </div>

        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative mb-6"
        >
          <span className="font-display text-9xl font-bold text-primary/20 select-none">404</span>
        </motion.div>

        {/* Message */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-display text-3xl font-bold mb-3"
        >
          Page Not Found
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-8 leading-relaxed"
        >
          The piece you're looking for seems to have slipped away. 
          Let's find something equally beautiful.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href="/">
            <Button className="gold-glow-hover px-8">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/#collections">
            <Button variant="outline" className="px-8">
              <Search className="w-4 h-4 mr-2" />
              Browse Collection
            </Button>
          </Link>
        </motion.div>

        {/* Decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 pt-8 border-t border-border/50"
        >
          <p className="text-xs text-muted-foreground">
            Need help? Contact us at{" "}
            <a href="mailto:support@gemessence.co.ke" className="text-primary hover:underline">
              support@gemessence.co.ke
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
