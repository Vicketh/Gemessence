import { useState, useCallback } from "react";
import { getLocalWishlist, saveLocalWishlist } from "@/lib/supabase";
import { useToast } from "./use-toast";

// Wishlist is localStorage-backed for GitHub Pages (static) mode.
// When a backend is available it can be extended to sync server-side.
export function useWishlist(userId?: number) {
  const { toast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<number[]>(() => getLocalWishlist());

  const addToWishlist = useCallback((uid: number | undefined, productId: number) => {
    setWishlistIds(prev => {
      if (prev.includes(productId)) return prev;
      const next = [...prev, productId];
      saveLocalWishlist(next);
      return next;
    });
    toast({ title: "Saved to Wishlist ♥", description: "Item added to your wishlist." });
  }, [toast]);

  const removeFromWishlist = useCallback((uid: number | undefined, productId: number) => {
    setWishlistIds(prev => {
      const next = prev.filter(id => id !== productId);
      saveLocalWishlist(next);
      return next;
    });
    toast({ title: "Removed from Wishlist", description: "Item removed from your wishlist." });
  }, [toast]);

  // wishlist items are just IDs; pages that need full product data join against the products list
  const wishlist = wishlistIds.map(id => ({ product: { id } }));

  return {
    wishlist,
    wishlistIds,
    isLoading: false,
    addToWishlist,
    removeFromWishlist,
    isAdding: false,
    isRemoving: false,
  };
}
