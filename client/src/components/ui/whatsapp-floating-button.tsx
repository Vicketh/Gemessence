import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export function WhatsAppFloatingButton() {
  const [isHovered, setIsHovered] = useState(false);

  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ["/api/superuser/settings"],
    queryFn: async () => {
      const res = await fetch("/api/superuser/settings");
      if (!res.ok) return {};
      return res.json();
    },
    staleTime: 60000,
  });

  const phoneNumber = settings?.whatsapp_number || "+254797534189";
  const message = settings?.whatsapp_message || "Hello! I'm interested in your jewelry collection.";

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const clean = phoneNumber.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${clean}?text=${encodedMessage}`, "_blank");
  };

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: -10, scale: 0.8 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : -10,
          scale: isHovered ? 1 : 0.8
        }}
        className="absolute bottom-16 left-0 bg-black/90 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm whitespace-nowrap"
      >
        Chat with us on WhatsApp
        <div className="absolute -bottom-1 left-4 w-2 h-2 bg-black/90 rotate-45" />
      </motion.div>

      {/* WhatsApp Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="icon"
          onClick={handleWhatsAppClick}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-2xl relative overflow-hidden"
        >
          <MessageCircle className="h-7 w-7 text-white" />
          
          {/* Pulse animation */}
          <motion.div
            className="absolute inset-0 rounded-full bg-green-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </Button>
      </motion.div>
    </motion.div>
  );
}