import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Heart, 
  ShoppingCart, 
  Phone, 
  MessageCircle,
  Sparkles,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

const actions = [
  {
    icon: Heart,
    label: "Wishlist",
    color: "bg-red-accent hover:bg-red-accent/90",
    action: () => console.log("Wishlist clicked")
  },
  {
    icon: ShoppingCart, 
    label: "Cart",
    color: "bg-primary hover:bg-primary/90",
    action: () => console.log("Cart clicked")
  },
  {
    icon: Phone,
    label: "Call Us",
    color: "bg-secondary hover:bg-secondary/90", 
    action: () => window.open("tel:+254700000000")
  },
  {
    icon: MessageCircle,
    label: "Chat",
    color: "bg-green-600 hover:bg-green-700",
    action: () => console.log("Chat clicked")
  }
];

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const sessionId = localStorage.getItem("cart_session_id");
  const { cart } = useCart(sessionId || undefined);
  const totalItems = cart?.totalItems || 0;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ 
                  opacity: 0, 
                  x: 20, 
                  y: 10,
                  transition: { delay: (actions.length - index - 1) * 0.05 }
                }}
                className="flex items-center gap-3"
              >
                <span className="bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                  {action.label}
                </span>
                <Button
                  size="icon"
                  onClick={action.action}
                  className={`h-12 w-12 rounded-full shadow-lg ${action.color} relative`}
                >
                  <action.icon className="h-5 w-5" />
                  {action.label === "Cart" && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-dual-accent hover:bg-dual-accent/90 shadow-2xl relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </motion.div>
          
          {/* Sparkle animation */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="h-4 w-4 absolute top-1 right-1 text-white/30" />
            <Sparkles className="h-3 w-3 absolute bottom-2 left-2 text-white/20" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}