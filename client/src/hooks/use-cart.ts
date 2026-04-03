import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "./use-toast";

export interface CartItemOptions {
  productId: number;
  quantity?: number;
  ringSize?: string;
  metalType?: string;
  metalColor?: string;
  chainLength?: string;
  engraving?: string;
  giftWrap?: boolean;
}

export function useCart(sessionId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const actualSessionId = sessionId || `guest-${Date.now()}`;

  const { data: cart, isLoading } = useQuery({
    queryKey: [api.cart.get.path, actualSessionId],
    queryFn: async () => {
      const res = await fetch(`${api.cart.get.path}?sessionId=${actualSessionId}`);
      if (!res.ok) return null;
      return res.json();
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async (item: CartItemOptions) => {
      const res = await fetch(`${api.cart.addItem.path}?sessionId=${actualSessionId}`, {
        method: api.cart.addItem.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to add to cart" }));
        throw new Error(err.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path, actualSessionId] });
      toast({
        title: "Added to Cart",
        description: "Item has been added to your shopping cart.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Add to Cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCartItemMutation = useMutation({
    mutationFn: async ({ cartItemId, data }: { cartItemId: number; data: Partial<CartItemOptions> }) => {
      const res = await fetch(`${api.cart.updateItem.path.replace(':id', String(cartItemId))}?sessionId=${actualSessionId}`, {
        method: api.cart.updateItem.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to update cart" }));
        throw new Error(err.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path, actualSessionId] });
    },
  });

  const removeCartItemMutation = useMutation({
    mutationFn: async (cartItemId: number) => {
      const res = await fetch(`${api.cart.removeItem.path.replace(':id', String(cartItemId))}?sessionId=${actualSessionId}`, {
        method: api.cart.removeItem.method,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to remove item" }));
        throw new Error(err.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path, actualSessionId] });
      toast({
        title: "Removed from Cart",
        description: "Item has been removed from your shopping cart.",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${api.cart.clear.path}?sessionId=${actualSessionId}`, {
        method: api.cart.clear.method,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to clear cart" }));
        throw new Error(err.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path, actualSessionId] });
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
      });
    },
  });

  return {
    cart,
    isLoading,
    addToCart: addToCartMutation.mutate,
    updateCartItem: updateCartItemMutation.mutate,
    removeCartItem: removeCartItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAdding: addToCartMutation.isPending,
    isUpdating: updateCartItemMutation.isPending,
    isRemoving: removeCartItemMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
}

export function useUpdateQuantity(cartItemId: number, sessionId?: string) {
  const queryClient = useQueryClient();
  const actualSessionId = sessionId || `guest-${Date.now()}`;

  return useMutation({
    mutationFn: async (quantity: number) => {
      const res = await fetch(`${api.cart.updateItem.path.replace(':id', String(cartItemId))}?sessionId=${actualSessionId}`, {
        method: api.cart.updateItem.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to update quantity" }));
        throw new Error(err.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path, actualSessionId] });
    },
  });
}
