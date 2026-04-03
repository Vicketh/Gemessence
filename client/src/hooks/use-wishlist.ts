import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "./use-toast";

export function useWishlist(userId?: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: [api.wishlist.get.path, userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`${api.wishlist.get.path}?userId=${userId}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!userId,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (!userId) throw new Error("User ID required");
      const res = await fetch(`${api.wishlist.addItem.path}?userId=${userId}`, {
        method: api.wishlist.addItem.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to add to wishlist" }));
        throw new Error(err.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.wishlist.get.path, userId] });
      toast({
        title: "Added to Wishlist",
        description: "Item has been added to your wishlist.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Add to Wishlist",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (!userId) throw new Error("User ID required");
      const res = await fetch(`${api.wishlist.removeItem.path.replace(':productId', String(productId))}?userId=${userId}`, {
        method: api.wishlist.removeItem.method,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to remove from wishlist" }));
        throw new Error(err.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.wishlist.get.path, userId] });
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    },
  });

  const checkWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (!userId) return false;
      const res = await fetch(`${api.wishlist.check.path.replace(':productId', String(productId))}?userId=${userId}`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.isInWishlist;
    },
  });

  return {
    wishlist,
    isLoading,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    checkWishlist: checkWishlistMutation.mutateAsync,
    isAdding: addToWishlistMutation.isPending,
    isRemoving: removeFromWishlistMutation.isPending,
  };
}
